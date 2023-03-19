import { OrderItems } from '@prisma/client';
import { Pagination } from 'src/shared/protocols/pagination.interface';
import { CreateOrderItemsDto } from '../dto/create-order-items.dto';

export abstract class OrderItemsRepository {
  abstract create(orderItems: CreateOrderItemsDto): Promise<OrderItems>;
  abstract findById(orderId: number, orderItemId: number): Promise<OrderItems>;
  abstract find(page: number, take: number): Promise<Pagination<OrderItems[]>>;
  abstract update(
    orderId: number,
    orderItemId: number,
    orderItems: CreateOrderItemsDto,
  ): Promise<OrderItems>;
  abstract delete(orderId: number, orderItemId: number): Promise<OrderItems>;
}
