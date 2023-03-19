import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AdminModule } from '../admin/admin.module';

import { ClientModule } from '../client/client.module';
import { BcryptService } from '../common/bcrypt/bcrypt.service';
import { TokenModule } from '../token/token.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAdminGuard } from './guards/jwt-admin.guard';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  controllers: [AuthController],
  imports: [
    TokenModule,
    ClientModule,
    AdminModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get('security.jwtSecret'),
          signOptions: {
            expiresIn: configService.get('security.jwtExpireTime'),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    BcryptService,
    GoogleStrategy,
    { provide: APP_GUARD, useClass: JwtAdminGuard },
  ],
  exports: [AuthService],
})
export class AuthModule {}
