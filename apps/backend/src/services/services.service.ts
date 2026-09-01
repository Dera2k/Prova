import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { LocationsService } from '../locations/locations.service';
import { FindProfessionalsQueryDto } from './dto/find-professionals-query.dto';
import { paginate, PaginatedResult } from '../common/utils/pagination.util';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service) private services: Repository<Service>,
    private locations: LocationsService,
  ) {}

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

  async findNearbyProfessionals(serviceId: string, query: FindProfessionalsQueryDto): Promise<PaginatedResult<unknown>> {
    await this.findOne(serviceId);

    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const radius = query.radius ?? 10;

    const { data, total } = await this.locations.findNearby(serviceId, query.lat, query.lng, radius, page, limit);
    return paginate(data, total, page, limit);
  }
}
