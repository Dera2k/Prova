import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ThrottleOtpGuard } from '../common/guards/throttle-otp.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import type { JwtPayload } from './jwt-payload.interface';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @UseGuards(ThrottleOtpGuard)
  @Post('send-otp')
  async sendOtp(@Body() dto: SendOtpDto) {
    await this.auth.sendOtp(dto.phone);
    return { success: true, message: 'OTP sent' };
  }

  @Post('verify-otp')
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    const result = await this.auth.verifyOtp(dto.phone, dto.code, dto.role, dto.fullName);
    return { success: true, ...result };
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refresh(@Body() dto: RefreshTokenDto) {
    const result = await this.auth.refreshTokens(dto.refreshToken);
    return { success: true, ...result };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@CurrentUser() user: JwtPayload, @Body() dto: RefreshTokenDto) {
    await this.auth.logout(user.sub, dto.refreshToken);
    return { success: true, message: 'Logged out' };
  }
}