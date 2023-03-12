import { ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ClientService } from 'src/modules/client/client.service';
import { AuthUser } from '../protocols/auth-user.interface';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(
    private jwtService: JwtService,
    private clientService: ClientService,
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
      const cookieName = this.configService.get('security.jwtCookieName');

      const jwtToken = request?.cookies?.[cookieName];

      if (!jwtToken) {
        return false;
      }

      const secret = this.configService.get('security.jwtSecret');

      const { id } = this.jwtService.verify<AuthUser>(jwtToken, {
        secret,
      });

      if (!id) {
        return false;
      }

      const userExists = await this.clientService.findById(id);

      if (!userExists) {
        return false;
      }

      return true;
    } catch (err) {
      return false;
    }
  }
}
