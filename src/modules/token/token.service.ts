import { Injectable } from '@nestjs/common';
import { CreateTokenDto } from './dto/create-token.dto';
import { TokenRepository } from './repository/token.repository';

@Injectable()
export class TokenService {
  constructor(private tokenRepository: TokenRepository) {}

  createOrUpdateToken(token: CreateTokenDto) {
    return this.tokenRepository.createOrUpdateToken(token);
  }

  findTokenByClientId(clientId: number) {
    return this.tokenRepository.findTokenByClientId(clientId);
  }
}
