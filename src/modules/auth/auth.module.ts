import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { ClientModule } from '../client/client.module';
import { BcryptService } from '../common/bcrypt/bcrypt.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  controllers: [AuthController],
  imports: [
    ClientModule,
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
  ],
  exports: [AuthService],
})
export class AuthModule {}
