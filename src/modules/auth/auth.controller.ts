import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CookieOptions, Response } from 'express';
import { AuthService } from './auth.service';
import { GetAuthUser } from './decorators/get-auth-user.decorator';
import { Cookie } from './decorators/get-cookie.decorator';
import { Public } from './decorators/public-route.decorator';
import { GoogleAuthDto } from './dto/google-auth.dto';
import { JwtAdminGuard } from './guards/jwt-admin.guard';
import { JwtClientGuard } from './guards/jwt-client.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { GetUserFromCookie } from './pipe/get-user-from-cookie.pipe';
import { AuthUser } from './protocols/auth-user.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  get cookieNameClient() {
    return this.configService.get('security.jwtCookieNameClient');
  }

  get cookieNameAdmin() {
    return this.configService.get('security.jwtCookieNameAdmin');
  }

  get createCookieConfig(): CookieOptions {
    return {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 1000 * 60 * 60 * 24 * 1,
      path: '/',
    };
  }

  get removeCookieConfig(): CookieOptions {
    return {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    };
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @GetAuthUser() user: AuthUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    const jwt = await this.authService.loginClient(user);

    response.cookie(
      this.cookieNameClient,
      jwt.access_token,
      this.createCookieConfig,
    );

    return jwt;
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login-admin')
  async loginAdmin(
    @GetAuthUser() admin: AuthUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    const jwt = await this.authService.loginAdmin(admin);

    response.cookie(
      this.cookieNameAdmin,
      jwt.access_token,
      this.createCookieConfig,
    );

    return jwt;
  }

  @Public()
  @Post('login-by-google')
  async loginByGoogle(
    @Body() googleAuthDto: GoogleAuthDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { id, email, name, role } = await this.authService.oauthLogin(
      googleAuthDto,
    );

    const jwt = await this.authService.loginClient({ id, email, name, role });

    response.cookie(
      this.cookieNameClient,
      jwt.access_token,
      this.createCookieConfig,
    );

    return jwt;
  }

  @Public()
  @Get('logout')
  async logout(
    @Cookie('client.session', GetUserFromCookie) user: AuthUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.logout(user);
    response.clearCookie(this.cookieNameClient, this.removeCookieConfig);

    return { logout: true };
  }

  @Public()
  @Get('logout-admin')
  async logoutAdmin(
    @Cookie('admin.session', GetUserFromCookie) admin: AuthUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.logoutAdmin(admin);
    response.clearCookie(this.cookieNameAdmin, this.removeCookieConfig);

    return { logout: true };
  }

  @Public()
  @UseGuards(JwtAdminGuard)
  @Get('logged-admin')
  getLoggedAdmin(@Cookie('admin.session', GetUserFromCookie) admin: AuthUser) {
    return { admin };
  }

  @Public()
  @UseGuards(JwtClientGuard)
  @Get('logged-client')
  getLoggedClient(@Cookie('client.session', GetUserFromCookie) user: AuthUser) {
    return { user };
  }
}
