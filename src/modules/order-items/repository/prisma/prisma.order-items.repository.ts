import { Injectable } from '@nestjs/common';
import { OrderItems } from '@prisma/client';
import { PrismaService } from 'src/modules/common/database/prisma.service';
import { PaginationService } from 'src/modules/common/pagination/pagination.service';
import { Pagination } from 'src/shared/interfaces/pagination.interface';
import { CreateOrderItemsDto } from '../../dto/create-order-items.dto';
import { UpdateOrderItemsDto } from '../../dto/update-order-items.dto';
import { OrderItemsRepository } from '../order-items.repository';

@Injectable()
export class PrismaOrderItemsRepository extends OrderItemsRepository {
  constructor(
    private prisma: PrismaService,
    private paginationService: PaginationService,
  ) {
    super();
  }

  create(orderItems: CreateOrderItemsDto): Promise<OrderItems> {
    return this.prisma.orderItems.create({
      data: orderItems,
    });
  }

  findById(orderId: number, orderItemId: number): Promise<OrderItems> {
    return this.prisma.orderItems.findUnique({
      where: { orderId_orderItemId: { orderId, orderItemId } },
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
    });
  }

  delete(orderId: number, orderItemId: number): Promise<OrderItems> {
    return this.prisma.orderItems.delete({
      where: { orderId_orderItemId: { orderId, orderItemId } },
    });
  }

  async find(page: number, take: number): Promise<Pagination<OrderItems[]>> {
    const totalOfItems = await this.prisma.orderItems.count();

    const { nextSkip, nextPageUrl, prevPageUrl, totalOfPages } =
      this.paginationService.getPagination({
        page,
        take,
        totalOfItems,
        route: '/order-items/find',
      });

    const results = await this.prisma.orderItems.findMany({
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
