import { Controller, Post, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { KycService } from './kyc.service';
import { SubmitKycDto } from './dto/submit-kyc.dto';
import { ReviewKycDto } from './dto/review-kyc.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/jwt-payload.interface';

@UseGuards(JwtAuthGuard)
@Controller('kyc')
export class KycController {
  constructor(private kyc: KycService) {}

  @Post()
  async submit(@CurrentUser() user: JwtPayload, @Body() dto: SubmitKycDto) {
    return this.kyc.submit(user.sub, dto);
  }

  @Get('me')
  async findMine(@CurrentUser() user: JwtPayload) {
    return this.kyc.findMine(user.sub);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Patch(':id/review')
  async review(@Param('id') id: string, @CurrentUser() user: JwtPayload, @Body() dto: ReviewKycDto) {
    return this.kyc.review(id, user.sub, dto);
  }
}