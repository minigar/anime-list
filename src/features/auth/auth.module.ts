import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/data/database.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from 'src/common/auth/strategies/google.strategy';
import { SessionSerializer } from './session.serializer';
import { AUTH_SERVICE_TOKEN } from 'src/common/constants';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'google', session: true }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: AUTH_SERVICE_TOKEN,
      useClass: AuthService,
    },
    GoogleStrategy,
    SessionSerializer,
  ],
  exports: [AUTH_SERVICE_TOKEN],
})
export class AuthModule {}
