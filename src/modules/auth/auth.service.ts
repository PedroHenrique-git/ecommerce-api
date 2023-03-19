import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import { AdminService } from '../admin/admin.service';
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
    private adminService: AdminService,
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
      role: 'customer',
    };

    return this.validateOauthUser(oauthUser);
  }

  async validateAdmin(
    email: string,
    password: string,
  ): Promise<Omit<AuthUser, 'name'>> {
    const admin = await this.adminService.findByEmail(email);

    if (!admin) {
      return null;
    }

    const isPasswordValid = await this.bcryptService.compare(
      password,
      admin.password ?? '',
    );

    if (admin && isPasswordValid) {
      return {
        id: admin.id,
        email: admin.email,
        role: admin.role,
      };
    }

    return null;
  }

  async validateClient(email: string, password: string): Promise<AuthUser> {
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
        role: client.role,
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

  async logoutAdmin(admin: Omit<AuthUser, 'name'>) {
    return await this.tokenService.createOrUpdateToken({
      adminId: admin.id,
      token: '',
    });
  }

  async loginAdmin(admin: Omit<AuthUser, 'name'>) {
    const jwt = {
      access_token: this.jwtService.sign(admin),
    };

    await this.tokenService.createOrUpdateToken({
      adminId: admin.id,
      token: jwt.access_token,
    });

    return jwt;
  }

  async loginClient(user: AuthUser) {
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
