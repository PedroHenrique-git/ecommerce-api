import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderRepository } from './repository/order.repository';

@Injectable()
export class OrderService {
  constructor(private orderRepository: OrderRepository) {}

  create(order: CreateOrderDto) {
    return this.orderRepository.create(order);
  }

  findById(id: number) {
    return this.orderRepository.findById(id);
  }

  findOrderItemsByOrderId(id: number) {
    return this.orderRepository.findOrderItemsByOrderId(id);
  }

  update(id: number, order: UpdateOrderDto) {
    return this.orderRepository.update(id, order);
  }

  delete(id: number) {
    return this.orderRepository.delete(id);
  }

  find(
    page: number,
    take: number,
    sort: Prisma.SortOrder,
    showClient: boolean,
  ) {
    return this.orderRepository.find(page, take, sort, showClient);
  }
}
