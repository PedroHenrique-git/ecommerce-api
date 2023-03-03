import { Category, Prisma } from '@prisma/client';

export interface Product {
  id: number;
  name: string;
  price: Prisma.Decimal;
  image: string;
  category?: Category;
  categoryId: number;
}
