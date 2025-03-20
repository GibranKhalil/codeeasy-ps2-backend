import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor() {
    super({
      clientID: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
      callbackURL: process.env.GITHUB_CALLBACK_URL || '',
      scope: ['user:email'],
    });

    if (
      !process.env.GITHUB_CLIENT_ID ||
      !process.env.GITHUB_CLIENT_SECRET ||
      !process.env.GITHUB_CALLBACK_URL
    ) {
      throw new Error(
        'As variáveis de ambiente do GitHub OAuth não estão presentes',
      );
    }
  }

  validate(accessToken: string, refreshToken: string, profile: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return profile;
  }
}
