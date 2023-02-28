import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/shared/database/prisma.service';
import { CreateCategoryDto } from '../../dto/create-category.dto';
import { Category } from '../../interfaces/category.interface';
import { CategoryRepository } from '../category.repository';

@Injectable()
export class PrismaCategoryRepository implements CategoryRepository {
  constructor(private prisma: PrismaService) {}

  create(category: CreateCategoryDto): Promise<Category> {
    return this.prisma.category.create({
      data: category,
    });
  }

  findById(id: number): Promise<Category> {
    return this.prisma.category.findUnique({
      where: { id },
      include: { products: true },
    });
  }

  update(id: number, category: CreateCategoryDto): Promise<Category> {
    return this.prisma.category.update({ where: { id }, data: category });
  }

  delete(id: number): Promise<Category> {
    return this.prisma.category.delete({ where: { id } });
  }

  getAll(): Promise<Category[]> {
    return this.prisma.category.findMany({ include: { products: true } });
  }
}
