import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleAuthGuard, GoogleVerificationGuard } from 'src/common/guards';
import { GoogleOAuthUser } from './auth.dto';
import { CurrentUser } from 'src/common/decarators';
import { User } from '@prisma/client';
import { AUTH_SERVICE_TOKEN } from 'src/common/constants';

@Controller()
export class AuthController {
  constructor(
    @Inject(AUTH_SERVICE_TOKEN) private readonly authService: AuthService,
  ) {}

  @Get('auth/google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {}

  @Get('auth/google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@CurrentUser() user: GoogleOAuthUser) {
    return user;
  }

  @Get('stats')
  @UseGuards(GoogleVerificationGuard)
  async getUser(@CurrentUser() user: User) {
    return user ? user : 'clg';
  }
}
