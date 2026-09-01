import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Professional } from './entities/professional.entity';
import { ProfessionalAvailability } from './entities/professional-availability.entity';
import { UpdateProfessionalDto } from './dto/update-professional.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';

@Injectable()
export class ProfessionalsService {
  constructor(
    @InjectRepository(Professional) private professionals: Repository<Professional>,
    @InjectRepository(ProfessionalAvailability) private availability: Repository<ProfessionalAvailability>,
  ) {}

  async findOne(id: string): Promise<Professional> {
    const professional = await this.professionals.findOne({ where: { id } });
    if (!professional) {
      throw new NotFoundException('Professional not found');
    }
    return professional;
  }

  async findByUserId(userId: string): Promise<Professional> {
    const professional = await this.professionals.findOne({ where: { userId } });
    if (!professional) {
      throw new NotFoundException('Professional profile not found');
    }
    return professional;
  }

  async updateProfile(userId: string, dto: UpdateProfessionalDto): Promise<Professional> {
    const professional = await this.findByUserId(userId);
    Object.assign(professional, dto);
    return this.professionals.save(professional);
  }

  async updateLocation(userId: string, latitude: number, longitude: number): Promise<Professional> {
    const professional = await this.findByUserId(userId);
    professional.latitude = latitude;
    professional.longitude = longitude;
    // location column synced via raw query since TypeORM doesn't cleanly map geography types
    await this.professionals.query(
      `UPDATE professionals SET location = ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography WHERE id = $3`,
      [longitude, latitude, professional.id],
    );
    return this.professionals.save(professional);
  }

  async updateAvailability(userId: string, dto: UpdateAvailabilityDto): Promise<ProfessionalAvailability[]> {
    const professional = await this.findByUserId(userId);

    if (dto.acceptUrgentNightCallouts !== undefined) {
      professional.isActive = professional.isActive; // no-op, keeps entity untouched here
    }

    await this.availability.delete({ professionalId: professional.id });

    const slots = dto.availability.map((slot) =>
      this.availability.create({ ...slot, professionalId: professional.id, acceptUrgentNightCallouts: dto.acceptUrgentNightCallouts ?? false }),
    );

    return this.availability.save(slots);
  }
}