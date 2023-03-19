import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const client = await this.authService.validateClient(email, password);

    if (client) {
      return client;
    }

    const admin = await this.authService.validateAdmin(email, password);

    if (admin) {
      return admin;
    }

    throw new UnauthorizedException('Invalid credentials');
  }
}
