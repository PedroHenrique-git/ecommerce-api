import { Module } from '@nestjs/common';
import { PrismaService } from '../common/database/prisma.service';
import { PrismaTokenRepository } from './repository/prisma/prisma.token.repository';
import { TokenRepository } from './repository/token.repository';
import { TokenService } from './token.service';

@Module({
  providers: [
    PrismaService,
    TokenService,
    { provide: TokenRepository, useClass: PrismaTokenRepository },
  ],
  exports: [TokenService],
})
export class TokenModule {}
