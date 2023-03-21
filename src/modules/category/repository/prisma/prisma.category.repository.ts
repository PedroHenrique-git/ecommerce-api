import { Injectable } from '@nestjs/common';
import { Category, Prisma } from '@prisma/client';
import { PrismaService } from 'src/modules/common/database/prisma.service';
import { PaginationService } from 'src/modules/common/pagination/pagination.service';
import { Pagination } from 'src/shared/protocols/pagination.interface';
import { CreateCategoryDto } from '../../dto/create-category.dto';
import { CategoryProducts } from '../../protocols/category-products.type';
import { CategoryRepository } from '../category.repository';

@Injectable()
export class PrismaCategoryRepository extends CategoryRepository {
  constructor(
    private prisma: PrismaService,
    private paginationService: PaginationService,
  ) {
    super();
  }

  create(category: CreateCategoryDto): Promise<Category> {
    return this.prisma.category.create({
      data: category,
    });
  }

  findById(id: number): Promise<Category> {
    return this.prisma.category.findUnique({
      where: { id },
    });
  }

  findProductsById(id: number): Promise<CategoryProducts> {
    return this.prisma.category.findUnique({
      where: { id },
      select: {
        products: {
          include: { orderItem: true },
        },
      },
    });
  }

  update(id: number, category: CreateCategoryDto): Promise<Category> {
    return this.prisma.category.update({
      where: { id },
      data: category,
    });
  }

  delete(id: number): Promise<Category> {
    return this.prisma.category.delete({
      where: { id },
    });
  }

  async find(
    page: number,
    take: number,
    sort: Prisma.SortOrder,
  ): Promise<Pagination<Category[]>> {
    const totalOfItems = await this.prisma.category.count();

    const { nextSkip, nextPageUrl, prevPageUrl, totalOfPages } =
      this.paginationService.getPagination({
        page,
        take,
        totalOfItems,
        route: '/category',
      });

    const results = await this.prisma.category.findMany({
      skip: nextSkip,
      take,
      orderBy: [{ id: sort }],
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
