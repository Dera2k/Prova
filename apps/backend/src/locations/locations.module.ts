import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationsService } from './locations.service';
import { Professional } from '../professionals/entities/professional.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Professional])],
  providers: [LocationsService],
  exports: [LocationsService],
})
export class LocationsModule {}