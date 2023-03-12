import { Injectable } from '@nestjs/common';
import { Order, OrderItem } from '@prisma/client';
import { PaginationService } from 'src/modules/common/pagination/pagination.service';
import { Pagination } from 'src/shared/interfaces/pagination.interface';
import { CreateOrderItemsDto } from '../../dto/create-order-items.dto';
import { OrderItems } from '../../protocols/order-items.interface';
import { OrderItemsRepository } from '../order-items.repository';

@Injectable()
export class InMemoryOrderItemsRepository extends OrderItemsRepository {
  constructor(private paginationService: PaginationService) {
    super();
  }

  private orderItems: OrderItems[] = [];

  create(orderItems: CreateOrderItemsDto): Promise<OrderItems> {
    const length = this.orderItems.push({
      order: {} as Order,
      orderItem: {} as OrderItem,
      ...orderItems,
    });

    return Promise.resolve(this.orderItems[length - 1]);
  }

  delete(orderId: number, orderItemId: number): Promise<OrderItems> {
    const index = this.orderItems.findIndex(
      (c) => c.orderId === orderId && c.orderItemId === orderItemId,
    );
    const orderItems = this.orderItems[index];

    this.orderItems = this.orderItems.filter(
      (c) => c.orderId !== orderId && c.orderItemId !== orderItemId,
    );

    if (!orderItems) {
      throw new Error('Record not found');
    }

    return Promise.resolve(orderItems);
  }

  findById(orderId: number, orderItemId: number): Promise<OrderItems> {
    return Promise.resolve(
      this.orderItems.find(
        (c) => c.orderId === orderId && c.orderItemId === orderItemId,
      ),
    );
  }

  update(
    orderId: number,
    orderItemId: number,
    orderItems: CreateOrderItemsDto,
  ): Promise<OrderItems> {
    let index = -1;

    const newOrderItems = this.orderItems.map((o, i) => {
      if (o.orderId === orderId && o.orderItemId === orderItemId) {
        index = i;

        return {
          ...o,
          ...orderItems,
        };
      }

      return o;
    });

    if (index === -1) {
      throw new Error('Record not found');
    }

    return Promise.resolve(newOrderItems[index]);
  }

  find(page: number, take: number): Promise<Pagination<OrderItems[]>> {
    const totalOfItems = this.orderItems.length;

    const { nextSkip, nextPageUrl, prevPageUrl, totalOfPages } =
      this.paginationService.getPagination({
        page,
        take,
        totalOfItems,
        route: '/order-items/find',
      });

    const results = this.orderItems.slice(nextSkip, page * take);

    return Promise.resolve({
      info: {
        nextPageUrl,
        prevPageUrl,
        totalOfItems,
        totalOfPages,
      },
      results,
    });
  }
}
