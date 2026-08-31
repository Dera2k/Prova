import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class JwtRefreshGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const token = (req.body as { refreshToken?: string })?.refreshToken;

    if (!token || typeof token !== 'string') {
      throw new UnauthorizedException('refreshToken required');
    }

    return true;
  }
}