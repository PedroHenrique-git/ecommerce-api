import { Injectable } from '@nestjs/common';
import { Client, Prisma } from '@prisma/client';
import { PrismaService } from 'src/modules/common/database/prisma.service';
import { PaginationService } from 'src/modules/common/pagination/pagination.service';
import { Pagination } from 'src/shared/protocols/pagination.interface';
import { CreateClientDto } from '../../dto/create-client.dto';
import { UpdateClientDto } from '../../dto/update-client.dto';
import { ClientOrders } from '../../protocols/client-orders.type';
import { ClientRepository } from '../client.repository';

@Injectable()
export class PrismaClientRepository extends ClientRepository {
  constructor(
    private prisma: PrismaService,
    private paginationService: PaginationService,
  ) {
    super();
  }

  findClientOrdersById(id: number): Promise<ClientOrders> {
    return this.prisma.client.findUnique({
      where: { id },
      select: {
        orders: {
          include: {
            ordersItems: {
              include: { orderItem: { include: { product: true } } },
            },
          },
        },
      },
    });
  }

  create(client: CreateClientDto): Promise<Client> {
    return this.prisma.client.create({
      data: client,
    });
  }

  findById(
    id: number,
    showCellphones: boolean,
    showAddresses: boolean,
  ): Promise<Client> {
    const include: Prisma.ClientInclude = {};

    if (showCellphones) {
      include.cellphones = { select: { id: true, cellphone: true } };
    }

    if (showAddresses) {
      include.addresses = {
        select: {
          id: true,
          cep: true,
          neighborhood: true,
          street: true,
        },
      };
    }

    return this.prisma.client.findUnique({
      where: { id },
      ...(showCellphones || showAddresses ? { include } : {}),
    });
  }

  findByEmail(email: string): Promise<Client> {
    return this.prisma.client.findUnique({
      where: { email },
    });
  }

  update(id: number, client: UpdateClientDto): Promise<Client> {
    return this.prisma.client.update({
      where: { id },
      data: client,
    });
  }

  delete(id: number): Promise<Client> {
    return this.prisma.client.delete({
      where: { id },
    });
  }

  async find(
    page: number,
    take: number,
    sort: Prisma.SortOrder,
  ): Promise<Pagination<Client[]>> {
    const totalOfItems = await this.prisma.client.count();

    const { nextSkip, nextPageUrl, prevPageUrl, totalOfPages } =
      this.paginationService.getPagination({
        page,
        take,
        totalOfItems,
        route: '/client',
      });

    const results = await this.prisma.client.findMany({
      skip: nextSkip,
      take,
      orderBy: [{ id: sort }],
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
