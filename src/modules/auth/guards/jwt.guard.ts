import { ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { TokenService } from 'src/modules/token/token.service';
import { Role } from 'src/shared/protocols/role.enum';
import { AuthUser } from '../protocols/auth-user.interface';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
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
      const authorizationHeader = request.headers.authorization;

      if (!authorizationHeader) {
        return false;
      }

      const cookieName = this.configService.get('security.jwtCookieNameClient');
      const cookieToken = request?.cookies?.[cookieName];

      if (!cookieToken) {
        return false;
      }

      const secret = this.configService.get('security.jwtSecret');
      const { id, role } = this.jwtService.verify<AuthUser>(cookieToken, {
        secret,
      });

      if (!id) {
        return false;
      }

      const userToken =
        role === Role.customer
          ? await this.tokenService.findTokenByClientId(id)
          : await this.tokenService.findTokenByAdminId(id);

      const [, headerToken] = authorizationHeader.split(' ');

      if (
        !userToken ||
        userToken?.token !== cookieToken ||
        userToken?.token !== headerToken
      ) {
        return false;
      }

      return true;
    } catch (err) {
      return false;
    }
  }
}
