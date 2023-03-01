import { Category } from '@prisma/client';

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category?: Category;
  categoryId: number;
}
