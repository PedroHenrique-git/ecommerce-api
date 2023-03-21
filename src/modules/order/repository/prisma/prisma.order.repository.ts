import { Injectable } from '@nestjs/common';
import { Order, Prisma } from '@prisma/client';
import { PrismaService } from 'src/modules/common/database/prisma.service';
import { PaginationService } from 'src/modules/common/pagination/pagination.service';
import { Pagination } from 'src/shared/protocols/pagination.interface';
import { CreateOrderDto } from '../../dto/create-order.dto';
import { UpdateOrderDto } from '../../dto/update-order.dto';
import { OrderWithProducts } from '../../protocols/order-with-products.type';
import { OrderRepository } from '../order.repository';

@Injectable()
export class PrismaOrderRepository extends OrderRepository {
  constructor(
    private prisma: PrismaService,
    private paginationService: PaginationService,
  ) {
    super();
  }

  create(order: CreateOrderDto): Promise<Order> {
    return this.prisma.order.create({
      data: order,
    });
  }

  findOrderItemsByOrderId(id: number): Promise<OrderWithProducts> {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        client: false,
        ordersItems: { select: { orderItem: { include: { product: true } } } },
      },
    });
  }

  findById(id: number): Promise<Order> {
    return this.prisma.order.findUnique({
      where: { id },
    });
  }

  update(id: number, order: UpdateOrderDto): Promise<Order> {
    return this.prisma.order.update({
      where: { id },
      data: order,
    });
  }

  delete(id: number): Promise<Order> {
    return this.prisma.order.delete({
      where: { id },
    });
  }

  async find(
    page: number,
    take: number,
    sort: Prisma.SortOrder,
    showClient: boolean,
  ): Promise<Pagination<Order[]>> {
    const totalOfItems = await this.prisma.orderItems.count();

    const { nextSkip, nextPageUrl, prevPageUrl, totalOfPages } =
      this.paginationService.getPagination({
        page,
        take,
        totalOfItems,
        route: '/order',
      });

    const results = await this.prisma.order.findMany({
      skip: nextSkip,
      take,
      orderBy: [{ id: sort }],
      ...(showClient
        ? { include: { client: { select: { email: true, name: true } } } }
        : {}),
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
