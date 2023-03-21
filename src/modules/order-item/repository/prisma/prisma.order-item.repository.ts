import { Injectable } from '@nestjs/common';
import { OrderItem, Prisma } from '@prisma/client';
import { PrismaService } from 'src/modules/common/database/prisma.service';
import { PaginationService } from 'src/modules/common/pagination/pagination.service';
import { Pagination } from 'src/shared/protocols/pagination.interface';
import { CreateOrderItemDto } from '../../dto/create-order-item.dto';
import { OrderItemRepository } from '../order-item.repository';

@Injectable()
export class PrismaOrderItemRepository extends OrderItemRepository {
  constructor(
    private prisma: PrismaService,
    private paginationService: PaginationService,
  ) {
    super();
  }

  create(orderItem: CreateOrderItemDto): Promise<OrderItem> {
    return this.prisma.orderItem.create({
      data: orderItem,
    });
  }

  findById(id: number): Promise<OrderItem> {
    return this.prisma.orderItem.findUnique({
      where: { id },
    });
  }

  update(id: number, orderItem: CreateOrderItemDto): Promise<OrderItem> {
    return this.prisma.orderItem.update({
      where: { id },
      data: orderItem,
    });
  }

  delete(id: number): Promise<OrderItem> {
    return this.prisma.orderItem.delete({
      where: { id },
    });
  }

  async find(
    page: number,
    take: number,
    sort: Prisma.SortOrder,
  ): Promise<Pagination<OrderItem[]>> {
    const totalOfItems = await this.prisma.orderItem.count();

    const { nextSkip, nextPageUrl, prevPageUrl, totalOfPages } =
      this.paginationService.getPagination({
        page,
        take,
        totalOfItems,
        route: '/order-item',
      });

    const results = await this.prisma.orderItem.findMany({
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
