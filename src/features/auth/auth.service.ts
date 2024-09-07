import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/data/database.service';
import { GoogleOAuthUser } from './auth.dto';
// import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(private readonly db: DatabaseService) {}

  async signInOrUp(profile: GoogleOAuthUser) {
    console.log(profile);
    const user = await this.db.user.findUnique({
      where: { email: profile.email },
    });

    if (user) return user;

    return await this.db.user.create({
      data: {
        name: profile.firstName,
        email: profile.email,
      },
    });
  }

  async findOne(email: string) {
    return await this.db.user.findUnique({ where: { email } });
  }

  // async logout(req: Request) {
  //   return req.session.destroy((err) => {
  //     err;
  //   });
  // }
}
