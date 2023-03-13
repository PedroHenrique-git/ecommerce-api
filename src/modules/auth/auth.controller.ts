import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CookieOptions, Response } from 'express';
import { AuthService } from './auth.service';
import { GetAuthUser } from './decorators/get-auth-user.decorator';
import { Cookie } from './decorators/get-cookie.decorator';
import { GoogleAuthDto } from './dto/google-auth.dto';
import { JwtGuard } from './guards/jwt.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { GetUserFromCookie } from './pipe/get-user-from-cookie.pipe';
import { AuthUser } from './protocols/auth-user.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  get cookieName() {
    return this.configService.get('security.jwtCookieName');
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

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(
    @GetAuthUser() user: AuthUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    const jwt = this.authService.login(user);

    response.cookie(this.cookieName, jwt.access_token, this.createCookieConfig);

    return jwt;
  }

  @Post('login-by-google')
  async loginByGoogle(
    @Body() googleAuthDto: GoogleAuthDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { id, email, name } = await this.authService.oauthLogin(
      googleAuthDto,
    );

    const jwt = this.authService.login({ id, email, name });

    response.cookie(this.cookieName, jwt.access_token, this.createCookieConfig);

    return jwt;
  }

  @Get('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie(this.cookieName, this.removeCookieConfig);

    return { logout: true };
  }

  @UseGuards(JwtGuard)
  @Get('logged-user')
  getLoggedUser(
    @Cookie('ecommerce.session', GetUserFromCookie) user: AuthUser,
  ) {
    return { user };
  }
}
