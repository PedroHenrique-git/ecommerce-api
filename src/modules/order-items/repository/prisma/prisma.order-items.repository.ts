import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/common/database/prisma.service';
import { getPagination } from 'src/shared/helpers/pagination';
import { Pagination } from 'src/shared/interfaces/pagination.interface';
import { CreateOrderItemsDto } from '../../dto/create-order-items.dto';
import { UpdateOrderItemsDto } from '../../dto/update-order-items.dto';
import { OrderItems } from '../../interfaces/order-items.interface';
import { OrderItemsRepository } from '../order-items.repository';

@Injectable()
export class PrismaOrderItemsRepository extends OrderItemsRepository {
  constructor(private prisma: PrismaService) {
    super();
  }

  create(orderItems: CreateOrderItemsDto): Promise<OrderItems> {
    return this.prisma.orderItems.create({
      data: orderItems,
      include: { order: true, orderItem: true },
    });
  }

  findById(orderId: number, orderItemId: number): Promise<OrderItems> {
    return this.prisma.orderItems.findUnique({
      where: { orderId_orderItemId: { orderId, orderItemId } },
      include: { order: true, orderItem: true },
    });
  }

  update(
    orderId: number,
    orderItemId: number,
    orderItem: UpdateOrderItemsDto,
  ): Promise<OrderItems> {
    return this.prisma.orderItems.update({
      where: { orderId_orderItemId: { orderId, orderItemId } },
      data: orderItem,
      include: { order: true, orderItem: true },
    });
  }

  delete(orderId: number, orderItemId: number): Promise<OrderItems> {
    return this.prisma.orderItems.delete({
      where: { orderId_orderItemId: { orderId, orderItemId } },
      include: { order: true, orderItem: true },
    });
  }

  async find(page: number, take: number): Promise<Pagination<OrderItems[]>> {
    const totalOfItems = await this.prisma.orderItems.count();

    const { nextSkip, nextPageUrl, prevPageUrl, totalOfPages } = getPagination({
      page,
      take,
      totalOfItems,
      route: '/order-items/find',
    });

    const results = await this.prisma.orderItems.findMany({
      include: { order: true, orderItem: true },
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
