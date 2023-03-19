import { OrderItem } from '@prisma/client';

export type CartItem = OrderItem & {
  price: number;
  name: string;
};
