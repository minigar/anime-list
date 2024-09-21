import {
  Controller,
  Get,
  Inject,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleAuthGuard, GoogleVerificationGuard } from 'src/common/guards';
import { GoogleOAuthUser } from './auth.dto';
import { CurrentUser } from 'src/common/decarators';
import { User } from '@prisma/client';
import { AUTH_SERVICE_TOKEN } from 'src/common/constants';
import { Request } from 'express';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

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
  async googleAuthRedirect(
    @CurrentUser() user: GoogleOAuthUser,
  ): Promise<GoogleOAuthUser> {
    return user;
  }
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30)
  @Get('stats')
  @UseGuards(GoogleVerificationGuard)
  async getUser(@CurrentUser() user: User): Promise<User | string> {
    return user ? user : 'clg';
  }

  @Get('logout')
  @UseGuards(GoogleVerificationGuard)
  async logout(@Req() req: Request) {
    return await this.authService.logout(req);
  }
}
