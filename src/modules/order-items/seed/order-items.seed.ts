import { CreateOrderItemsDto } from '../dto/create-order-items.dto';

export default function seederOrderItems(quantityOfOrderItems: number) {
  const orderItems: CreateOrderItemsDto[] = [];

  for (let i = 1; i <= quantityOfOrderItems; i++) {
    orderItems.push({
      orderId: i,
      orderItemId: i,
    });
  }

  return orderItems;
}
