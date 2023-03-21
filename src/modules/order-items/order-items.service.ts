import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateOrderItemsDto } from './dto/create-order-items.dto';
import { UpdateOrderItemsDto } from './dto/update-order-items.dto';
import { OrderItemsRepository } from './repository/order-items.repository';

@Injectable()
export class OrderItemsService {
  constructor(private orderItemsRepository: OrderItemsRepository) {}

  create(orderItems: CreateOrderItemsDto) {
    return this.orderItemsRepository.create(orderItems);
  }

  findById(orderId: number, orderItemId: number) {
    return this.orderItemsRepository.findById(orderId, orderItemId);
  }

  update(
    orderId: number,
    orderItemId: number,
    orderItems: UpdateOrderItemsDto,
  ) {
    return this.orderItemsRepository.update(orderId, orderItemId, orderItems);
  }

  delete(orderId: number, orderItemId: number) {
    return this.orderItemsRepository.delete(orderId, orderItemId);
  }

  find(page: number, take: number, sort: Prisma.SortOrder) {
    return this.orderItemsRepository.find(page, take, sort);
  }
}
