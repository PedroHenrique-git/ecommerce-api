import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/common/database/prisma.service';
import { getPagination } from 'src/shared/helpers/pagination';
import { Pagination } from 'src/shared/interfaces/pagination.interface';
import { CreateOrderDto } from '../../dto/create-order.dto';
import { UpdateOrderDto } from '../../dto/update-order.dto';
import { OrderWithProducts } from '../../interfaces/order-with-products.interface';
import { Order } from '../../interfaces/order.interface';
import { OrderRepository } from '../order.repository';

@Injectable()
export class PrismaOrderRepository extends OrderRepository {
  constructor(private prisma: PrismaService) {
    super();
  }

  create(order: CreateOrderDto): Promise<Order> {
    return this.prisma.order.create({
      data: order,
      include: { client: true, ordersItems: true },
    });
  }

  findOrderItemsByOrderId(id: number): Promise<OrderWithProducts> {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        client: true,
        ordersItems: { select: { orderItem: { include: { product: true } } } },
      },
    });
  }

  findById(id: number): Promise<Order> {
    return this.prisma.order.findUnique({
      where: { id },
      include: { client: true, ordersItems: true },
    });
  }

  update(id: number, order: UpdateOrderDto): Promise<Order> {
    return this.prisma.order.update({
      where: { id },
      data: order,
      include: { client: true, ordersItems: true },
    });
  }

  delete(id: number): Promise<Order> {
    return this.prisma.order.delete({
      where: { id },
      include: { client: true, ordersItems: true },
    });
  }

  async find(page: number, take: number): Promise<Pagination<Order[]>> {
    const totalOfItems = await this.prisma.orderItems.count();

    const { nextSkip, nextPageUrl, prevPageUrl, totalOfPages } = getPagination({
      page,
      take,
      totalOfItems,
      route: '/order/find',
    });

    const results = await this.prisma.order.findMany({
      include: { client: true, ordersItems: true },
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
