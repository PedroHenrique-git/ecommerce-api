import { Injectable } from '@nestjs/common';
import { Address } from '@prisma/client';
import { PrismaService } from 'src/modules/common/database/prisma.service';
import { PaginationService } from 'src/modules/common/pagination/pagination.service';
import { Pagination } from 'src/shared/protocols/pagination.interface';
import { CreateAddressDto } from '../../dto/create-address.dto';
import { UpdateAddressDto } from '../../dto/update-address.dto';
import { AddressRepository } from '../address.repository';

@Injectable()
export class PrismaAddressRepository extends AddressRepository {
  constructor(
    private prisma: PrismaService,
    private paginationService: PaginationService,
  ) {
    super();
  }

  create(address: CreateAddressDto): Promise<Address> {
    return this.prisma.address.create({ data: address });
  }

  update(id: number, address: UpdateAddressDto): Promise<Address> {
    return this.prisma.address.update({ where: { id }, data: address });
  }

  findById(id: number): Promise<Address> {
    return this.prisma.address.findUnique({
      where: { id },
    });
  }

  delete(id: number): Promise<Address> {
    return this.prisma.address.delete({
      where: { id },
    });
  }

  async find(page: number, take: number): Promise<Pagination<Address[]>> {
    const totalOfItems = await this.prisma.address.count();

    const { nextSkip, nextPageUrl, prevPageUrl, totalOfPages } =
      this.paginationService.getPagination({
        page,
        take,
        totalOfItems,
        route: '/address',
      });

    const results = await this.prisma.address.findMany({
      skip: nextSkip,
      take,
    });

    return {
      info: {
        nextPageUrl,
        prevPageUrl,
        totalOfItems,
        totalOfPages,
      },
      results,
    };
  }
}
