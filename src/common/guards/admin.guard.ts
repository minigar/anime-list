import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { AUTH_SERVICE_TOKEN, UserRoles } from '../constants';
import { AuthService } from 'src/features/auth/auth.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    @Inject(AUTH_SERVICE_TOKEN) private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const req = await context.switchToHttp().getRequest();

    if (req?.user) {
      const { id } = req.user;

      const user = await this.authService.getById(id);
      return user.role === UserRoles.ADMIN;
    }
  }
}
