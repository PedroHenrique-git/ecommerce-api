import { Injectable } from '@nestjs/common';
import { Client } from '@prisma/client';
import { PaginationService } from 'src/modules/common/pagination/pagination.service';
import { Pagination } from 'src/shared/interfaces/pagination.interface';
import { CreateOrderDto } from '../../dto/create-order.dto';
import { UpdateOrderDto } from '../../dto/update-order.dto';
import { Order } from '../../protocols/order.interface';
import { OrderRepository } from '../order.repository';

@Injectable()
export class InMemoryOrderRepository extends OrderRepository {
  constructor(private paginationService: PaginationService) {
    super();
  }

  private orders: Order[] = [];

  private getNextId() {
    const lastIndex = this.orders.length;

    return lastIndex === 0 ? 1 : lastIndex + 1;
  }

  findOrderItemsByOrderId(id: number): Promise<any> {
    return Promise.resolve(this.orders.find((c) => c.id === id));
  }

  create(order: CreateOrderDto): Promise<Order> {
    const length = this.orders.push({
      id: this.getNextId(),
      client: {} as Client,
      ordersItems: [],
      ...order,
    });

    return Promise.resolve(this.orders[length - 1]);
  }

  delete(id: number): Promise<Order> {
    const index = this.orders.findIndex((c) => c.id === id);
    const order = this.orders[index];

    this.orders = this.orders.filter((c) => c.id !== id);

    if (!order) {
      throw new Error('Record not found');
    }

    return Promise.resolve(order);
  }

  findById(id: number): Promise<Order> {
    return Promise.resolve(this.orders.find((c) => c.id === id));
  }

  update(id: number, order: UpdateOrderDto): Promise<Order> {
    let index = -1;

    const newOrders = this.orders.map((o, i) => {
      if (o.id === id) {
        index = i;

        return {
          ...o,
          ...order,
        };
      }

      return o;
    });

    if (index === -1) {
      throw new Error('Record not found');
    }

    return Promise.resolve(newOrders[index]);
  }

  find(page: number, take: number): Promise<Pagination<Order[]>> {
    const totalOfItems = this.orders.length;

    const { nextSkip, nextPageUrl, prevPageUrl, totalOfPages } =
      this.paginationService.getPagination({
        page,
        take,
        totalOfItems,
        route: '/order/find',
      });

    const results = this.orders.slice(nextSkip, page * take);

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
