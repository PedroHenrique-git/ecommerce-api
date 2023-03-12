import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientService } from '../client/client.service';
import { BcryptService } from '../common/bcrypt/bcrypt.service';
import { AuthUser } from './protocols/auth-user.interface';
import { OauthUser } from './protocols/oauth-user.interface';

@Injectable()
export class AuthService {
  constructor(
    private clientService: ClientService,
    private jwtService: JwtService,
    private bcryptService: BcryptService,
  ) {}

  async validateOauthUser(oauthUser: OauthUser) {
    const clientFromDB = await this.clientService.findByEmail(oauthUser.email);

    if (clientFromDB) {
      return clientFromDB;
    }
    const { email, name, provider, providerId } = oauthUser;

    return this.clientService.create({
      email,
      name,
      provider,
      providerId,
      address: '',
      cellphone: '',
      password: '',
    });
  }

  async validateUser(email: string, password: string): Promise<AuthUser> {
    const client = await this.clientService.findByEmail(email);
    const isPasswordValid = await this.bcryptService.compare(
      password,
      client.password ?? '',
    );

    if (client && isPasswordValid) {
      return {
        id: client.id,
        email: client.email,
        name: client.name,
      };
    }

    return null;
  }

  login(user: AuthUser | OauthUser) {
    return {
      access_token: this.jwtService.sign(user),
    };
  }
}
