import { Injectable } from '@nestjs/common';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { OrderItemRepository } from './repository/order-item.repository';

@Injectable()
export class OrderItemService {
  constructor(private orderItemRepository: OrderItemRepository) {}

  create(orderItem: CreateOrderItemDto) {
    return this.orderItemRepository.create(orderItem);
  }

  findById(id: number) {
    return this.orderItemRepository.findById(id);
  }

  update(id: number, orderItem: CreateOrderItemDto) {
    return this.orderItemRepository.update(id, orderItem);
  }

  delete(id: number) {
    return this.orderItemRepository.delete(id);
  }

  find(page: number, take: number) {
    return this.orderItemRepository.find(page, take);
  }
}
