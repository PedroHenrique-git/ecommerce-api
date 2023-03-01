import { Pagination } from 'src/shared/interfaces/pagination.interface';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { Category } from '../interfaces/category.interface';

export abstract class CategoryRepository {
  abstract create(category: CreateCategoryDto): Promise<Category>;
  abstract findById(id: number): Promise<Category>;
  abstract find(page: number, take: number): Promise<Pagination<Category[]>>;
  abstract update(id: number, category: CreateCategoryDto): Promise<Category>;
  abstract delete(id: number): Promise<Category>;
}
