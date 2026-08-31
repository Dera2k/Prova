import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import * as crypto from 'crypto';

@Injectable()
export class OtpService {
  private readonly TTL = 300;
  private readonly MAX_ATTEMPTS = 5;

  constructor(@Inject('REDIS_CLIENT') private redis: Redis) {}

  async generateAndSend(phone: string): Promise<void> {
    const code = crypto.randomInt(100000, 999999).toString();

    await this.redis.set(`otp:code:${phone}`, code, 'EX', this.TTL);
    await this.redis.del(`otp:attempts:${phone}`);

    // TODO Phase 5: replace with TermiiSmsProvider.send(phone, code)
    console.log(`[OTP] ${phone} -> ${code}`);
  }

  async verify(phone: string, code: string): Promise<void> {
    const stored = await this.redis.get(`otp:code:${phone}`);

    if (!stored) {
      throw new BadRequestException('OTP expired. Request a new code.');
    }

    const attempts = await this.redis.incr(`otp:attempts:${phone}`);
    await this.redis.expire(`otp:attempts:${phone}`, this.TTL);

    if (attempts > this.MAX_ATTEMPTS) {
      await this.redis.del(`otp:code:${phone}`);
      throw new BadRequestException('Too many attempts. Request a new code.');
    }

    if (stored !== code) {
      throw new BadRequestException('Invalid code.');
    }

    await this.redis.del(`otp:code:${phone}`);
    await this.redis.del(`otp:attempts:${phone}`);
  }
}