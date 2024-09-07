import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from 'src/features/auth/auth.service';
import { GoogleOAuthUser } from 'src/features/auth/auth.dto';
import { Inject } from '@nestjs/common';
import { AUTH_SERVICE_TOKEN } from 'src/common/constants';
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @Inject(AUTH_SERVICE_TOKEN) private readonly authService: AuthService,
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3001/auth/google/callback',
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

    console.log(user);
    await this.authService.signInOrUp(user);

    done(null, user);
  }
}
