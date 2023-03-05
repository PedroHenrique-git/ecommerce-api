import { Product } from '@prisma/client';
import { getPagination } from 'src/shared/helpers/pagination';
import { Pagination } from 'src/shared/interfaces/pagination.interface';
import { CreateOrderItemDto } from '../../dto/create-order-item.dto';
import { OrderItem } from '../../interfaces/order-item.interface';
import { OrderItemRepository } from '../order-item.repository';

export class InMemoryOrderItemRepository extends OrderItemRepository {
  private orderItems: OrderItem[] = [];

  private getNextId() {
    const lastIndex = this.orderItems.length;

    return lastIndex === 0 ? 1 : lastIndex + 1;
  }

  create(orderItem: CreateOrderItemDto): Promise<OrderItem> {
    const length = this.orderItems.push({
      id: this.getNextId(),
      ...orderItem,
      orders: [],
      product: {} as Product,
    });

    return Promise.resolve(this.orderItems[length - 1]);
  }

  delete(id: number): Promise<OrderItem> {
    const index = this.orderItems.findIndex((c) => c.id === id);
    const orderItem = this.orderItems[index];

    this.orderItems = this.orderItems.filter((c) => c.id !== id);

    if (!orderItem) {
      throw new Error('Record not found');
    }

    return Promise.resolve(orderItem);
  }

  findById(id: number): Promise<OrderItem> {
    return Promise.resolve(this.orderItems.find((c) => c.id === id));
  }

  update(id: number, orderItem: CreateOrderItemDto): Promise<OrderItem> {
    let index = -1;

    const newOrderItems = this.orderItems.map((oi, i) => {
      if (oi.id === id) {
        index = i;

        return {
          ...oi,
          ...orderItem,
        };
      }

      return oi;
    });

    if (index === -1) {
      throw new Error('Record not found');
    }

    return Promise.resolve(newOrderItems[index]);
  }

  find(page: number, take: number): Promise<Pagination<OrderItem[]>> {
    const totalOfItems = this.orderItems.length;

    const { nextSkip, nextPageUrl, prevPageUrl, totalOfPages } = getPagination({
      page,
      take,
      totalOfItems,
      route: '/order-item/find',
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
