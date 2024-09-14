import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class GoogleVerificationGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    return request.isAuthenticated();
  }
}
