import { Injectable } from '@nestjs/common';
import { Prisma, Product } from '@prisma/client';
import { PrismaService } from 'src/modules/common/database/prisma.service';
import { PaginationService } from 'src/modules/common/pagination/pagination.service';
import { Pagination } from 'src/shared/protocols/pagination.interface';
import { CreateProductDto } from '../../dto/create-product.dto';
import { ProductRepository } from '../product.repository';

@Injectable()
export class PrismaProductRepository extends ProductRepository {
  constructor(
    private prisma: PrismaService,
    private paginationService: PaginationService,
  ) {
    super();
  }

  create(product: CreateProductDto): Promise<Product> {
    return this.prisma.product.create({
      data: product,
    });
  }

  findById(id: number): Promise<Product> {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  update(id: number, product: CreateProductDto): Promise<Product> {
    return this.prisma.product.update({
      where: { id },
      data: product,
    });
  }

  delete(id: number): Promise<Product> {
    return this.prisma.product.delete({
      where: { id },
    });
  }

  async find(
    page: number,
    take: number,
    sort: Prisma.SortOrder,
  ): Promise<Pagination<Product[]>> {
    const totalOfItems = await this.prisma.product.count();

    const { nextSkip, nextPageUrl, prevPageUrl, totalOfPages } =
      this.paginationService.getPagination({
        page,
        take,
        totalOfItems,
        route: '/product',
      });

    const results = await this.prisma.product.findMany({
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
