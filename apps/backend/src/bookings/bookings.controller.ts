import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { QuotationsService } from '../quotations/quotations.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { CancelBookingDto } from './dto/cancel-booking.dto';
import { CreateQuotationDto } from '../quotations/dto/create-quotation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/jwt-payload.interface';
import { UserRole } from '../common/enums/user-role.enum';

@UseGuards(JwtAuthGuard)
@Controller('bookings')
export class BookingsController {
  constructor(
    private bookings: BookingsService,
    private quotations: QuotationsService,
  ) {}

  @Post()
  async create(@CurrentUser() user: JwtPayload, @Body() dto: CreateBookingDto) {
    return this.bookings.create(user.sub, dto);
  }

  @Get()
  async findAll(@CurrentUser() user: JwtPayload, @Query('status') status?: string) {
    const role = user.role === UserRole.PROFESSIONAL ? 'professional' : 'customer';
    return this.bookings.findByUser(user.sub, role, status);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.bookings.findById(id);
  }

  @Get(':id/status')
  async getStatus(@Param('id') id: string) {
    const booking = await this.bookings.findById(id);
    return { status: booking.status };
  }

  @Patch(':id/status')
  async updateStatus(@CurrentUser() user: JwtPayload, @Param('id') id: string, @Body() dto: UpdateBookingStatusDto) {
    return this.bookings.updateStatus(id, user.sub, user.role, dto.status);
  }

  @Post(':id/cancel')
  async cancel(@CurrentUser() user: JwtPayload, @Param('id') id: string, @Body() dto: CancelBookingDto) {
    return this.bookings.cancel(id, user.sub, user.role, dto);
  }

  @Get(':id/quotation')
  async getQuotation(@Param('id') id: string) {
    return this.quotations.findByBooking(id);
  }

  @Post(':id/quotation')
  async createQuotation(@CurrentUser() user: JwtPayload, @Param('id') id: string, @Body() dto: CreateQuotationDto) {
    await this.bookings.assertProfessionalOwnsBooking(id, user.sub);
    return this.quotations.create(id, dto);
  }
}
