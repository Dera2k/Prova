import { Controller, Get, Post, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { FindProfessionalsQueryDto } from './dto/find-professionals-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@Controller()
export class ServicesController {
  constructor(private services: ServicesService) {}

  @Get('services')
  async findAll() {
    return this.services.findAll();
  }

  @Get('services/:id')
  async findOne(@Param('id') id: string) {
    return this.services.findOne(id);
  }

  @Get('services/:id/professionals')
  async findNearbyProfessionals(@Param('id') id: string, @Query() query: FindProfessionalsQueryDto) {
    return this.services.findNearbyProfessionals(id, query);
  }

  @Get('categories/:id/services')
  async findByCategory(@Param('id') id: string) {
    return this.services.findByCategory(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Post('services')
  async create(@Body() dto: CreateServiceDto) {
    return this.services.create(dto);
  }
}
