import { OrderItems, Product } from '@prisma/client';

export interface OrderItem {
  id: number;
  product: Product;
  productId: number;
  orders: OrderItems[];
}
