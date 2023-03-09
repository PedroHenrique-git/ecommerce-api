import { Pagination } from 'src/shared/interfaces/pagination.interface';
import { CreateOrderItemDto } from '../dto/create-order-item.dto';
import { OrderItem } from '../protocols/order-item.interface';

export abstract class OrderItemRepository {
  abstract create(orderItem: CreateOrderItemDto): Promise<OrderItem>;
  abstract findById(id: number): Promise<OrderItem>;
  abstract find(page: number, take: number): Promise<Pagination<OrderItem[]>>;
  abstract update(
    id: number,
    orderItem: CreateOrderItemDto,
  ): Promise<OrderItem>;
  abstract delete(id: number): Promise<OrderItem>;
}
