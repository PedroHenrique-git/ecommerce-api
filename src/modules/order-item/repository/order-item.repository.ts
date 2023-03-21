import { OrderItem, Prisma } from '@prisma/client';
import { Pagination } from 'src/shared/protocols/pagination.interface';
import { CreateOrderItemDto } from '../dto/create-order-item.dto';
import { UpdateOrderItemDto } from '../dto/update-order-item.dto';

export abstract class OrderItemRepository {
  abstract create(orderItem: CreateOrderItemDto): Promise<OrderItem>;
  abstract findById(id: number): Promise<OrderItem>;
  abstract find(
    page: number,
    take: number,
    sort: Prisma.SortOrder,
  ): Promise<Pagination<OrderItem[]>>;
  abstract update(
    id: number,
    orderItem: UpdateOrderItemDto,
  ): Promise<OrderItem>;
  abstract delete(id: number): Promise<OrderItem>;
}
