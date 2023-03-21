import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryRepository } from './repository/category.repository';

@Injectable()
export class CategoryService {
  constructor(private categoryRepository: CategoryRepository) {}

  create(category: CreateCategoryDto) {
    return this.categoryRepository.create(category);
  }

  findById(id: number) {
    return this.categoryRepository.findById(id);
  }

  findProductsById(id: number) {
    return this.categoryRepository.findProductsById(id);
  }

  update(id: number, category: CreateCategoryDto) {
    return this.categoryRepository.update(id, category);
  }

  delete(id: number) {
    return this.categoryRepository.delete(id);
  }

  find(page: number, take: number, sort: Prisma.SortOrder) {
    return this.categoryRepository.find(page, take, sort);
  }
}
