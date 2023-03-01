import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/common/database/prisma.service';
import { getPagination } from 'src/shared/helpers/pagination';
import { Pagination } from 'src/shared/interfaces/pagination.interface';
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

  async find(page: number, take: number): Promise<Pagination<Category[]>> {
    const totalOfItems = await this.prisma.category.count();

    const { nextSkip, nextPageUrl, prevPageUrl, totalOfPages } = getPagination({
      page,
      take,
      totalOfItems,
      route: '/category/find',
    });

    const results = await this.prisma.category.findMany({
      include: { products: true },
      skip: nextSkip,
      take,
    });

    return {
      info: {
        nextPageUrl,
        prevPageUrl,
        totalOfItems,
        totalOfPages,
      },
      results,
    };
  }
}
