import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User, AuthProvider } from '../users/entities/user.entity';
import { UserRole } from '../common/enums/user-role.enum';
import { RefreshToken } from '../users/entities/refresh-token.entity';
import { OtpService } from './otp.service';
import { hash } from '../common/utils/hash.util';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private users: Repository<User>,
    @InjectRepository(RefreshToken) private tokens: Repository<RefreshToken>,
    private otp: OtpService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async sendOtp(phone: string): Promise<void> {
    await this.otp.generateAndSend(phone);
  }

  async verifyOtp(phone: string, code: string, role?: UserRole, fullName?: string): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    await this.otp.verify(phone, code);

    let user = await this.users.findOne({ where: { phone } });

    if (!user) {
      if (!role) {
        throw new BadRequestException('role required for signup');
      }
      user = this.users.create({ phone, fullName, role, authProvider: AuthProvider.PHONE, phoneVerified: true });
      await this.users.save(user);
    } else if (!user.phoneVerified) {
      user.phoneVerified = true;
      await this.users.save(user);
    }

    const tokens = await this.issueTokens(user);
    return { user, ...tokens };
  }

  async refreshTokens(rawToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const tokenHash = hash(rawToken);
    const stored = await this.tokens.findOne({ where: { tokenHash, revoked: false } });

    if (!stored || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    stored.revoked = true;
    await this.tokens.save(stored);

    const user = await this.users.findOne({ where: { id: stored.userId } });
    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or inactive');
    }

    return this.issueTokens(user);
  }

  async logout(userId: string, rawToken: string): Promise<void> {
    const tokenHash = hash(rawToken);
    await this.tokens.update({ userId, tokenHash }, { revoked: true });
  }

  private async issueTokens(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { sub: user.id, role: user.role };

    const accessToken = this.jwt.sign(payload, {
      secret: this.config.get<string>('jwt.accessSecret'),
      expiresIn: this.config.get<string>('jwt.accessExpiresIn') as any,
    });

    const rawRefreshToken = crypto.randomBytes(40).toString('hex');
    const expiresIn = this.config.get<string>('jwt.refreshExpiresIn') as string;
    const expiresAt = this.parseExpiry(expiresIn);

    const token = this.tokens.create({ userId: user.id, tokenHash: hash(rawRefreshToken), expiresAt });
    await this.tokens.save(token);

    return { accessToken, refreshToken: rawRefreshToken };
  }

  private parseExpiry(str: string): Date {
    const match = str.match(/^(\d+)([smhd])$/);
    if (!match) throw new Error(`Invalid expiry: ${str}`);

    const [, value, unit] = match;
    const ms: Record<string, number> = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
    return new Date(Date.now() + Number(value) * ms[unit]);
  }
}