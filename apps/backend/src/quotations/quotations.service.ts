import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quotation } from './entities/quotation.entity';
import { CreateQuotationDto } from './dto/create-quotation.dto';
import { QuotationStatus } from '../common/enums/quotation-status.enum';
import { Booking } from '../bookings/entities/booking.entity';
import { CategoryFee } from '../categories/entities/category-fee.entity';
import { Service } from '../services/entities/service.entity';
import { Professional } from '../professionals/entities/professional.entity';
import { UserRole } from '../common/enums/user-role.enum';
import { BookingStatus } from '../common/enums/booking-status.enum';
import { BookingsService } from '../bookings/bookings.service';

@Injectable()
export class QuotationsService {
  constructor(
    @InjectRepository(Quotation) private quotations: Repository<Quotation>,
    @InjectRepository(Booking) private bookings: Repository<Booking>,
    @InjectRepository(Service) private services: Repository<Service>,
    @InjectRepository(CategoryFee) private categoryFees: Repository<CategoryFee>,
    @InjectRepository(Professional) private professionals: Repository<Professional>,
    private bookingsService: BookingsService,
  ) {}

  async create(bookingId: string, dto: CreateQuotationDto, requesterId: string): Promise<Quotation> {
    const booking = await this.bookings.findOne({ where: { id: bookingId } });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const existing = await this.quotations.findOne({ where: { bookingId } });
    if (existing) {
      throw new BadRequestException('Quotation already exists for this booking');
    }

    const professional = await this.professionals.findOne({ where: { userId: requesterId } });
    if (!professional || professional.id !== booking.professionalId) {
      throw new ForbiddenException('You are not the assigned professional for this booking');
    }

    const service = await this.services.findOne({ where: { id: booking.serviceId } });
    if (!service) {
      throw new NotFoundException('Service not found');
    }

    const categoryFee = await this.categoryFees.findOne({ where: { categoryId: service.categoryId } });
    const inspectionFee = categoryFee?.inspectionFee ?? 0;

    const total = dto.labourCost + dto.materialsCost + dto.serviceFee;

    const quotation = this.quotations.create({
      bookingId,
      labourCost: dto.labourCost,
      materialsCost: dto.materialsCost,
      inspectionFee,
      serviceFee: dto.serviceFee,
      total,
      notes: dto.notes ?? null,
      status: QuotationStatus.SENT,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    return this.quotations.save(quotation);
  }

  async findByBooking(bookingId: string): Promise<Quotation> {
    const quotation = await this.quotations.findOne({ where: { bookingId } });
    if (!quotation) {
      throw new NotFoundException('Quotation not found');
    }
    return this.checkExpiry(quotation);
  }

  async accept(id: string, requesterId: string): Promise<Quotation> {
    const quotation = await this.findOrThrow(id);
    const checked = await this.checkExpiry(quotation);

    if (checked.status !== QuotationStatus.SENT) {
      throw new BadRequestException(`Cannot accept quotation with status ${checked.status}`);
    }

    const booking = await this.bookings.findOne({ where: { id: checked.bookingId } });
    if (!booking || booking.customerId !== requesterId) {
      throw new ForbiddenException('You are not the customer who owns this booking');
    }

    checked.status = QuotationStatus.ACCEPTED;
    await this.quotations.save(checked);

    await this.bookingsService.updateStatus(booking.id, requesterId, UserRole.CUSTOMER, BookingStatus.ACCEPTED);

    return checked;
  }

  async reject(id: string, requesterId: string): Promise<Quotation> {
    const quotation = await this.findOrThrow(id);
    const checked = await this.checkExpiry(quotation);

    if (checked.status !== QuotationStatus.SENT) {
      throw new BadRequestException(`Cannot reject quotation with status ${checked.status}`);
    }

    const booking = await this.bookings.findOne({ where: { id: checked.bookingId } });
    if (!booking || booking.customerId !== requesterId) {
      throw new ForbiddenException('You are not the customer who owns this booking');
    }

    checked.status = QuotationStatus.REJECTED;
    return this.quotations.save(checked);
  }

  private async findOrThrow(id: string): Promise<Quotation> {
    const quotation = await this.quotations.findOne({ where: { id } });
    if (!quotation) {
      throw new NotFoundException('Quotation not found');
    }
    return quotation;
  }

  private async checkExpiry(quotation: Quotation): Promise<Quotation> {
    if (quotation.status === QuotationStatus.SENT && quotation.expiresAt < new Date()) {
      quotation.status = QuotationStatus.EXPIRED;
      return this.quotations.save(quotation);
    }
    return quotation;
  }
}
