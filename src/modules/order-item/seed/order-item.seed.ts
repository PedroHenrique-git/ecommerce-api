import { faker } from '@faker-js/faker';
import { CreateOrderItemDto } from '../dto/create-order-item.dto';

export default function seederOrderItem(quantityOfOrderItems: number) {
  const orderItems: CreateOrderItemDto[] = [];

  for (let i = 1; i <= quantityOfOrderItems; i++) {
    orderItems.push({
      productId: i,
      quantity: faker.datatype.number({ min: 0, max: 1000000 }),
    });
  }

  return orderItems;
}
