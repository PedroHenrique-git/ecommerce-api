import { ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { TokenService } from 'src/modules/token/token.service';
import { IS_PUBLIC_KEY } from '../decorators/public-route.decorator';
import { AuthUser } from '../protocols/auth-user.interface';

@Injectable()
export class JwtAdminGuard extends AuthGuard('jwt') {
  constructor(
    private jwtService: JwtService,
    private tokenService: TokenService,
    private configService: ConfigService,
    private reflector: Reflector,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    try {
      const isPublic = this.reflector.getAllAndOverride<boolean>(
        IS_PUBLIC_KEY,
        [context.getHandler(), context.getClass()],
      );

      if (isPublic) {
        return true;
      }

      const can = (await super.canActivate(context)) as Boolean;

      if (!can) {
        return false;
      }

      const request = context.switchToHttp().getRequest() as Request;
      const authorizationHeader = request.headers.authorization;

      if (!authorizationHeader) {
        return false;
      }

      const cookieName = this.configService.get('security.jwtCookieNameAdmin');
      const cookieToken = request?.cookies?.[cookieName];

      if (!cookieToken) {
        return false;
      }

      const secret = this.configService.get('security.jwtSecret');
      const { id } = this.jwtService.verify<Omit<AuthUser, 'name'>>(
        cookieToken,
        {
          secret,
        },
      );

      if (!id) {
        return false;
      }

      const adminToken = await this.tokenService.findTokenByAdminId(id);

      const [, headerToken] = authorizationHeader.split(' ');

      if (
        !adminToken ||
        adminToken?.token !== cookieToken ||
        adminToken?.token !== headerToken
      ) {
        return false;
      }

      return true;
    } catch (err) {
      return false;
    }
  }
}
