import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthUser } from '../protocols/auth-user.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const authContext = request?.headers?.['auth-context'] as
            | 'client'
            | 'admin';

          const targetCookie =
            authContext === 'admin'
              ? configService.get('security.jwtCookieNameAdmin')
              : configService.get('security.jwtCookieNameClient');

          const jwtCookie = request?.cookies?.[targetCookie];

          if (!jwtCookie) {
            return null;
          }

          return jwtCookie;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('security.jwtSecret'),
    });
  }

  async validate(client: AuthUser) {
    if (!client) {
      throw new UnauthorizedException();
    }

    return client;
  }
}
