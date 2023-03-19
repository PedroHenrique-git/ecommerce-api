import { Module } from '@nestjs/common';
import { BcryptService } from '../common/bcrypt/bcrypt.service';
import { PrismaService } from '../common/database/prisma.service';
import { HandleErrorService } from '../common/handleError/handleError.service';
import { PaginationService } from '../common/pagination/pagination.service';
import { ValidationService } from '../common/validation/validation.service';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { ClientRepository } from './repository/client.repository';
import { PrismaClientRepository } from './repository/prisma/prisma.client.repository';

@Module({
  controllers: [ClientController],
  providers: [
    PrismaService,
    PaginationService,
    BcryptService,
    ValidationService,
    HandleErrorService,
    ClientService,
    { provide: ClientRepository, useClass: PrismaClientRepository },
  ],
  exports: [ClientService],
})
export class ClientModule {}
