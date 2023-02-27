import { CreateCategoryDto } from '../dto/create-category.dto';
import { Category } from '../interfaces/category.interface';

export abstract class CategoryRepository {
  abstract create(category: CreateCategoryDto): Promise<Category>;
  abstract findById(id: number): Promise<Category>;
  abstract update(id: number, category: CreateCategoryDto): Promise<Category>;
  abstract delete(id: number): Promise<Category>;
  abstract getAll(): Promise<Category[]>;
}
