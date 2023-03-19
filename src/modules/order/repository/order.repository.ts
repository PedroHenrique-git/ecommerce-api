import { Order } from '@prisma/client';
import { Pagination } from 'src/shared/protocols/pagination.interface';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';

export abstract class OrderRepository {
  abstract create(order: CreateOrderDto): Promise<Order>;
  abstract findById(id: number): Promise<Order>;
  abstract findOrderItemsByOrderId(id: number): Promise<any>;
  abstract find(page: number, take: number): Promise<Pagination<Order[]>>;
  abstract update(id: number, order: UpdateOrderDto): Promise<Order>;
  abstract delete(id: number): Promise<Order>;
}
