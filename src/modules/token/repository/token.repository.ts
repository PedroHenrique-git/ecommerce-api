import { Token } from '@prisma/client';
import { CreateTokenDto } from '../dto/create-token.dto';

export abstract class TokenRepository {
  abstract createOrUpdateToken(token: CreateTokenDto): Promise<Token>;
  abstract findTokenByClientId(clientId: number): Promise<Token>;
}
