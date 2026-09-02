import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { BookingStatusHistory } from './entities/booking-status-history.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CancelBookingDto } from './dto/cancel-booking.dto';
import { BookingStatus } from '../common/enums/booking-status.enum';
import { assertValidTransition, BookingActor } from './booking-state-machine';
import { Professional } from '../professionals/entities/professional.entity';
import { ProfessionalService } from '../professionals/entities/professional-service.entity';
import { ProfessionalVerificationStatus } from '../common/enums/professional-status.enum';
import { Address } from '../addresses/entities/address.entity';
import { UserRole } from '../common/enums/user-role.enum';
import * as crypto from 'crypto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking) private bookings: Repository<Booking>,
    @InjectRepository(BookingStatusHistory) private history: Repository<BookingStatusHistory>,
    @InjectRepository(Professional) private professionals: Repository<Professional>,
    @InjectRepository(ProfessionalService) private professionalServices: Repository<ProfessionalService>,
    @InjectRepository(Address) private addresses: Repository<Address>,
  ) {}

  async create(customerId: string, dto: CreateBookingDto): Promise<Booking> {
    const professional = await this.professionals.findOne({ where: { id: dto.professionalId } });
    if (!professional) {
      throw new NotFoundException('Professional not found');
    }
    if (professional.verificationStatus !== ProfessionalVerificationStatus.VERIFIED) {
      throw new BadRequestException('Professional is not verified');
    }
    if (!professional.isAvailable) {
      throw new BadRequestException('Professional is not currently available');
    }

    const offersService = await this.professionalServices.findOne({
      where: { professionalId: dto.professionalId, serviceId: dto.serviceId },
    });
    if (!offersService) {
      throw new BadRequestException('Professional does not offer this service');
    }

    if (!dto.addressId && !dto.newAddress) {
      throw new BadRequestException('addressId or newAddress is required');
    }
    if (dto.addressId && dto.newAddress) {
      throw new BadRequestException('Provide either addressId or newAddress, not both');
    }

    let addressSnapshot: Record<string, unknown>;
    let addressId: string | null = null;

    if (dto.addressId) {
      const address = await this.addresses.findOne({ where: { id: dto.addressId, userId: customerId } });
      if (!address) {
        throw new NotFoundException('Address not found');
      }
      addressId = address.id;
      addressSnapshot = { ...address };
    } else {
      addressSnapshot = { ...dto.newAddress };
    }

    const reference = `PRV-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const acceptanceDeadline = new Date(Date.now() + 2 * 60 * 60 * 1000);

    const booking = this.bookings.create({
      reference,
      customerId,
      professionalId: dto.professionalId,
      serviceId: dto.serviceId,
      addressId,
      addressSnapshot,
      description: dto.description,
      attachmentUrls: dto.attachmentUrls.map((a) => a.url),
      notes: dto.notes ?? null,
      scheduledFor: dto.scheduledFor ? new Date(dto.scheduledFor) : null,
      acceptanceDeadline,
      status: BookingStatus.PENDING,
    });

    await this.bookings.save(booking);
    await this.recordHistory(booking.id, BookingStatus.PENDING, 'Booking created');

    return booking;
  }

  async findById(id: string): Promise<Booking> {
    const booking = await this.bookings.findOne({ where: { id } });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    return booking;
  }

  async findByUser(userId: string, role: 'customer' | 'professional', status?: string): Promise<Booking[]> {
    const where: Record<string, unknown> = {};

    if (role === 'customer') {
      where.customerId = userId;
    } else {
      const professional = await this.professionals.findOne({ where: { userId } });
      if (!professional) {
        return [];
      }
      where.professionalId = professional.id;
    }

    if (status) {
      where.status = status;
    }

    return this.bookings.find({ where, order: { createdAt: 'DESC' } });
  }

  async updateStatus(id: string, requesterId: string, requesterRole: UserRole, newStatus: BookingStatus): Promise<Booking> {
    const booking = await this.findById(id);
    const actor = await this.resolveActor(booking, requesterId, requesterRole);

    assertValidTransition(booking.status, newStatus, actor);

    booking.status = newStatus;
    await this.bookings.save(booking);
    await this.recordHistory(booking.id, newStatus, null);

    if (newStatus === BookingStatus.COMPLETED) {
      // TODO Phase 4: deduct commission from wallet, credit net to professional
      // TODO Phase 5: emit review prompt notification to customer
    }

    return booking;
  }

  async cancel(id: string, requesterId: string, requesterRole: UserRole, dto: CancelBookingDto): Promise<Booking> {
    const booking = await this.findById(id);
    const actor = await this.resolveActor(booking, requesterId, requesterRole);

    assertValidTransition(booking.status, BookingStatus.CANCELLED, actor);

    booking.status = BookingStatus.CANCELLED;
    await this.bookings.save(booking);
    await this.recordHistory(booking.id, BookingStatus.CANCELLED, dto.reason);

    return booking;
  }

  async getStatusHistory(bookingId: string): Promise<BookingStatusHistory[]> {
    return this.history.find({ where: { bookingId }, order: { timestamp: 'ASC' } });
  }

  private async resolveActor(booking: Booking, requesterId: string, requesterRole: UserRole): Promise<BookingActor> {
    if (requesterRole === UserRole.CUSTOMER) {
      if (booking.customerId !== requesterId) {
        throw new ForbiddenException('You are not the customer on this booking');
      }
      return 'CUSTOMER';
    }

    if (requesterRole === UserRole.PROFESSIONAL) {
      const professional = await this.professionals.findOne({ where: { userId: requesterId } });
      if (!professional || professional.id !== booking.professionalId) {
        throw new ForbiddenException('You are not the professional on this booking');
      }
      return 'PROFESSIONAL';
    }

    throw new ForbiddenException('Only customers or professionals can modify bookings');
  }

  private async recordHistory(bookingId: string, status: BookingStatus, note: string | null): Promise<void> {
    const entry = this.history.create({ bookingId, status, note });
    await this.history.save(entry);
  }
}
