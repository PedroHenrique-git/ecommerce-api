import { Module } from '@nestjs/common';
import { PrismaService } from '../common/database/prisma.service';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { ClientRepository } from './repository/client.repository';
import { PrismaClientRepository } from './repository/prisma/prisma.client.repository';

@Module({
  controllers: [ClientController],
  providers: [
    PrismaService,
    ClientService,
    { provide: ClientRepository, useClass: PrismaClientRepository },
  ],
})
export class ClientModule {}
