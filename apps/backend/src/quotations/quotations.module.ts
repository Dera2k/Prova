import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuotationsController } from './quotations.controller';
import { QuotationsService } from './quotations.service';
import { Quotation } from './entities/quotation.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { Service } from '../services/entities/service.entity';
import { CategoryFee } from '../categories/entities/category-fee.entity';
import { BookingsModule } from '../bookings/bookings.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Quotation, Booking, Service, CategoryFee]),
    BookingsModule,
  ],
  controllers: [QuotationsController],
  providers: [QuotationsService],
  exports: [QuotationsService],
})
export class QuotationsModule {}