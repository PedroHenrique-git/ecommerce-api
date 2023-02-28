import { Category } from 'src/modules/category/interfaces/category.interface';

export interface Product {
  name: string;
  price: number;
  image: string;
  category: Category;
  categoryId: number;
}
