import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';
import { CreateServiceDto } from './dto/create-service.dto';

@Injectable()
export class ServicesService {
  constructor(@InjectRepository(Service) private services: Repository<Service>) {}

  async findAll(): Promise<Service[]> {
    return this.services.find({ where: { isActive: true } });
  }

  async findOne(id: string): Promise<Service> {
    const service = await this.services.findOne({ where: { id } });
    if (!service) {
      throw new NotFoundException('Service not found');
    }
    return service;
  }

  async findByCategory(categoryId: string): Promise<Service[]> {
    return this.services.find({ where: { categoryId, isActive: true } });
  }

  async create(dto: CreateServiceDto): Promise<Service> {
    const service = this.services.create(dto);
    return this.services.save(service);
  }
}