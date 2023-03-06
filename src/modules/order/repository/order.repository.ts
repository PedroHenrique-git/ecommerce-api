import { Pagination } from 'src/shared/interfaces/pagination.interface';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { Order } from '../interfaces/order.interface';

export abstract class OrderRepository {
  abstract create(order: CreateOrderDto): Promise<Order>;
  abstract findById(id: number): Promise<Order>;
  abstract findOrderItemsByOrderId(id: number): Promise<any>;
  abstract find(page: number, take: number): Promise<Pagination<Order[]>>;
  abstract update(id: number, order: UpdateOrderDto): Promise<Order>;
  abstract delete(id: number): Promise<Order>;
}
