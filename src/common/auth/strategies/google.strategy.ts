import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from 'src/features/auth/auth.service';
import { GoogleOAuthUser } from 'src/features/auth/auth.dto';
import { Inject } from '@nestjs/common';
import { AUTH_SERVICE_TOKEN } from 'src/common/constants';
import { ConfigService } from '@nestjs/config';
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @Inject(AUTH_SERVICE_TOKEN) private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    const id = configService.getOrThrow<string>('GOOGLE_CLIENT_ID');
    const secret = configService.getOrThrow<string>('GOOGLE_CLIENT_SECRET');
    const host = configService.getOrThrow<string>('GOOGLE_CLIENT_HOST');
    const port = configService.getOrThrow<string>('APP_PORT');
    const callbackUrl = configService.getOrThrow<string>(
      'GOOGLE_CLIENT_CALLBACK_URL',
    );
    super({
      clientID: id,
      clientSecret: secret,
      callbackURL: `http://${host}:${port}/${callbackUrl}`,
      scope: ['email', 'profile'],
      prompt: 'consent',
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<void> {
    const { name, emails, photos } = profile;

    const user: GoogleOAuthUser = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      photo: photos[0].value,
      accessToken,
      refreshToken,
    };

    await this.authService.signInOrUp(user);

    done(null, user);
  }
}
