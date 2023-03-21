import { ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { TokenService } from 'src/modules/token/token.service';
import { AuthUser } from '../protocols/auth-user.interface';

@Injectable()
export class JwtClientGuard extends AuthGuard('jwt') {
  constructor(
    private jwtService: JwtService,
    private tokenService: TokenService,
    private configService: ConfigService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    try {
      const can = (await super.canActivate(context)) as Boolean;

      if (!can) {
        return false;
      }

      const request = context.switchToHttp().getRequest() as Request;
      const cookieName = this.configService.get('security.jwtCookieNameClient');
      const cookieToken = request?.cookies?.[cookieName];

      if (!cookieToken) {
        return false;
      }

      const secret = this.configService.get('security.jwtSecret');
      const { id } = this.jwtService.verify<AuthUser>(cookieToken, {
        secret,
      });

      if (!id) {
        return false;
      }

      const userToken = await this.tokenService.findTokenByClientId(id);

      if (!userToken || userToken?.token !== cookieToken) {
        return false;
      }

      return true;
    } catch (err) {
      return false;
    }
  }
}
