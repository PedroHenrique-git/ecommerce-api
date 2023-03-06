import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/common/database/prisma.service';
import { getPagination } from 'src/shared/helpers/pagination';
import { Pagination } from 'src/shared/interfaces/pagination.interface';
import { CreateClientDto } from '../../dto/create-client.dto';
import { UpdateClientDto } from '../../dto/update-client.dto';
import { Client } from '../../interfaces/client.interface';
import { ClientRepository } from '../client.repository';

@Injectable()
export class PrismaClientRepository extends ClientRepository {
  constructor(private prisma: PrismaService) {
    super();
  }

  create(client: CreateClientDto): Promise<Client> {
    return this.prisma.client.create({
      data: client,
      include: { orders: true },
    });
  }

  findById(id: number): Promise<Client> {
    return this.prisma.client.findUnique({
      where: { id },
      include: { orders: true },
    });
  }

  update(id: number, client: UpdateClientDto): Promise<Client> {
    return this.prisma.client.update({
      where: { id },
      data: client,
      include: { orders: true },
    });
  }

  delete(id: number): Promise<Client> {
    return this.prisma.client.delete({
      where: { id },
      include: { orders: true },
    });
  }

  async find(page: number, take: number): Promise<Pagination<Client[]>> {
    const totalOfItems = await this.prisma.orderItems.count();

    const { nextSkip, nextPageUrl, prevPageUrl, totalOfPages } = getPagination({
      page,
      take,
      totalOfItems,
      route: '/client/find',
    });

    const results = await this.prisma.client.findMany({
      include: { orders: true },
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
