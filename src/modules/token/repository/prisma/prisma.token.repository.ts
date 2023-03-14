import { Injectable } from '@nestjs/common';
import { Token } from '@prisma/client';
import { PrismaService } from 'src/modules/common/database/prisma.service';
import { CreateTokenDto } from '../../dto/create-token.dto';
import { TokenRepository } from '../token.repository';

@Injectable()
export class PrismaTokenRepository extends TokenRepository {
  constructor(private prisma: PrismaService) {
    super();
  }

  createOrUpdateToken(token: CreateTokenDto): Promise<Token> {
    const { clientId, token: tokenValue } = token;

    return this.prisma.token.upsert({
      where: { clientId },
      create: token,
      update: { token: tokenValue },
    });
  }

  findTokenByClientId(clientId: number): Promise<Token> {
    return this.prisma.token.findUnique({ where: { clientId } });
  }
}
