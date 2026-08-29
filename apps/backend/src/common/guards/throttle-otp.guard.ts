import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Request } from 'express';

@Injectable()
export class ThrottleOtpGuard extends ThrottlerGuard {
  // throttle by phone number, not IP - shared NAT means multiple real users share an IP
  protected async getTracker(req: Request): Promise<string> {
    const phone = (req.body as { phone?: string })?.phone;
    return phone ? `otp:${phone}` : req.ip ?? 'unknown';
  }
}