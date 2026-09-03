import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { Booking } from './entities/booking.entity';
import { BookingStatusHistory } from './entities/booking-status-history.entity';
import { Professional } from '../professionals/entities/professional.entity';
import { ProfessionalService } from '../professionals/entities/professional-service.entity';
import { Address } from '../addresses/entities/address.entity';
import { QuotationsModule } from '../quotations/quotations.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, BookingStatusHistory, Professional, ProfessionalService, Address]),
    QuotationsModule,
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}