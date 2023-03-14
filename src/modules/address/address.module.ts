import { Module } from '@nestjs/common';
import { PrismaService } from '../common/database/prisma.service';
import { HandleErrorService } from '../common/handleError/handleError.service';
import { PaginationService } from '../common/pagination/pagination.service';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';
import { AddressRepository } from './repository/address.repository';
import { PrismaAddressRepository } from './repository/prisma/prisma.address.repository';

@Module({
  controllers: [AddressController],
  providers: [
    PrismaService,
    AddressService,
    PaginationService,
    HandleErrorService,
    { provide: AddressRepository, useClass: PrismaAddressRepository },
  ],
})
export class AddressModule {}
