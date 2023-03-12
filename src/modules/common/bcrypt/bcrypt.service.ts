import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService {
  constructor(private configService: ConfigService) {}

  async hash(password: string) {
    const salts = this.configService.get('security.salts');

    return bcrypt.hash(password, salts);
  }

  async compare(plainPassword: string, hashedPassword: string) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
