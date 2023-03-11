import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/common/database/prisma.service';
import { getPagination } from 'src/shared/helpers/general/pagination';
import { Pagination } from 'src/shared/interfaces/pagination.interface';
import { CreateOrderItemDto } from '../../dto/create-order-item.dto';
import { OrderItem } from '../../protocols/order-item.interface';
import { OrderItemRepository } from '../order-item.repository';

@Injectable()
export class PrismaOrderItemRepository extends OrderItemRepository {
  constructor(private prisma: PrismaService) {
    super();
  }

  create(orderItem: CreateOrderItemDto): Promise<OrderItem> {
    return this.prisma.orderItem.create({
      data: orderItem,
      include: { orders: true, product: true },
    });
  }

  findById(id: number): Promise<OrderItem> {
    return this.prisma.orderItem.findUnique({
      where: { id },
      include: { orders: true, product: true },
    });
  }

  update(id: number, orderItem: CreateOrderItemDto): Promise<OrderItem> {
    return this.prisma.orderItem.update({
      where: { id },
      data: orderItem,
      include: { orders: true, product: true },
    });
  }

  delete(id: number): Promise<OrderItem> {
    return this.prisma.orderItem.delete({
      where: { id },
      include: { orders: true, product: true },
    });
  }

  async find(page: number, take: number): Promise<Pagination<OrderItem[]>> {
    const totalOfItems = await this.prisma.orderItem.count();

    const { nextSkip, nextPageUrl, prevPageUrl, totalOfPages } = getPagination({
      page,
      take,
      totalOfItems,
      route: '/order-item/find',
    });

    const results = await this.prisma.orderItem.findMany({
      include: { orders: true, product: true },
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
