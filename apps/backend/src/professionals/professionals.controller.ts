import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ProfessionalsService } from './professionals.service';
import { UpdateProfessionalDto } from './dto/update-professional.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { IsNumber } from 'class-validator';

class UpdateLocationDto {
  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;
}

@Controller('professionals')
export class ProfessionalsController {
  constructor(private professionals: ProfessionalsService) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.professionals.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateProfile(@CurrentUser() user: JwtPayload, @Body() dto: UpdateProfessionalDto) {
    return this.professionals.updateProfile(user.sub, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/availability')
  async updateAvailability(@CurrentUser() user: JwtPayload, @Body() dto: UpdateAvailabilityDto) {
    return this.professionals.updateAvailability(user.sub, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/location')
  async updateLocation(@CurrentUser() user: JwtPayload, @Body() dto: UpdateLocationDto) {
    return this.professionals.updateLocation(user.sub, dto.latitude, dto.longitude);
  }
}