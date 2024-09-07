/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { Inject, Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { User } from '@prisma/client';
import { AUTH_SERVICE_TOKEN } from 'src/common/constants';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(
    @Inject(AUTH_SERVICE_TOKEN) private readonly authService: AuthService,
  ) {
    super();
  }

  serializeUser(user: User, done: Function) {
    done(null, user);
  }

  async deserializeUser(payload: User, done: Function) {
    const user = await this.authService.getByEmail(payload.email);
    return user ? done(null, user) : done(null, null);
  }
}
