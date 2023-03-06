import { CreateOrderDto } from '../dto/create-order.dto';

export default function seederOrder(quantityOfOrders: number) {
  const orders: CreateOrderDto[] = [];

  for (let i = 1; i <= quantityOfOrders; i++) {
    orders.push({
      clientId: i,
      status: 'pending',
    });
  }

  return orders;
}
