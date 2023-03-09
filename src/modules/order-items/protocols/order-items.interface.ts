import { Order, OrderItem } from '@prisma/client';

export interface OrderItems {
  orderId: number;
  orderItemId: number;
  order: Order;
  orderItem: OrderItem;
}
