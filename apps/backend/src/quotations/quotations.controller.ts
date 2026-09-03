import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { QuotationsService } from './quotations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/jwt-payload.interface';
import { CreateQuotationDto } from './dto/create-quotation.dto';

@UseGuards(JwtAuthGuard)
@Controller('bookings')
export class QuotationsController {
  constructor(private quotations: QuotationsService) {}

  @Get(':id/quotation')
  async findByBooking(@Param('id') id: string) {
    return this.quotations.findByBooking(id);
  }

  @Post(':id/quotation')
  async create(@CurrentUser() user: JwtPayload, @Param('id') id: string, @Body() dto: CreateQuotationDto) {
    return this.quotations.create(id, dto);
  }

  @Post('quotations/:id/accept')
  async accept(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.quotations.accept(id, user.sub);
  }

  @Post('quotations/:id/reject')
  async reject(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.quotations.reject(id, user.sub);
  }
}
