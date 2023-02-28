import { Product } from '@prisma/client';

export interface Category {
  id: number;
  name: string;
  products?: Product[];
}
