import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import { ClientService } from '../client/client.service';
import { BcryptService } from '../common/bcrypt/bcrypt.service';
import { TokenService } from '../token/token.service';
import { GoogleAuthDto } from './dto/google-auth.dto';
import { AuthUser } from './protocols/auth-user.interface';
import { OauthUser } from './protocols/oauth-user.interface';

@Injectable()
export class AuthService {
  private google: OAuth2Client;

  constructor(
    private clientService: ClientService,
    private tokenService: TokenService,
    private jwtService: JwtService,
    private bcryptService: BcryptService,
    private configService: ConfigService,
  ) {
    this.google = new OAuth2Client(
      this.configService.get('google.clientId'),
      this.configService.get('google.clientSecret'),
      'postmessage',
    );
  }

  private async validateOauthUser(oauthUser: OauthUser) {
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

  async oauthLogin(googleAuthDto: GoogleAuthDto) {
    const { tokens } = await this.google.getToken(googleAuthDto.idToken);

    const { id_token } = tokens;

    const ticket = await this.google.verifyIdToken({
      idToken: id_token,
      audience: [this.configService.get('google.clientId')],
    });

    const googleUser = ticket.getPayload();

    const oauthUser: OauthUser = {
      email: googleUser.email,
      name: `${googleUser.given_name} ${googleUser.family_name}`,
      provider: 'google',
      providerId: googleUser.sub,
    };

    return this.validateOauthUser(oauthUser);
  }

  async validateUser(email: string, password: string): Promise<AuthUser> {
    const client = await this.clientService.findByEmail(email);

    if (!client) {
      return null;
    }

    const isOauthClientWithoutPassword =
      client.provider && client.providerId && !client.password;

    if (isOauthClientWithoutPassword) {
      throw new UnauthorizedException();
    }

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

  async logout(user: AuthUser) {
    return await this.tokenService.createOrUpdateToken({
      clientId: user.id,
      token: '',
    });
  }

  async login(user: AuthUser) {
    const jwt = {
      access_token: this.jwtService.sign(user),
    };

    await this.tokenService.createOrUpdateToken({
      clientId: user.id,
      token: jwt.access_token,
    });

    return jwt;
  }
}
