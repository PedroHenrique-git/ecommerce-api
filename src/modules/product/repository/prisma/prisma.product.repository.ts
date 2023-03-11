import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/common/database/prisma.service';
import { getPagination } from 'src/shared/helpers/general/pagination';
import { Pagination } from 'src/shared/interfaces/pagination.interface';
import { CreateProductDto } from '../../dto/create-product.dto';
import { Product } from '../../protocols/product.interface';
import { ProductRepository } from '../product.repository';

@Injectable()
export class PrismaProductRepository extends ProductRepository {
  constructor(private prisma: PrismaService) {
    super();
  }

  create(product: CreateProductDto): Promise<Product> {
    return this.prisma.product.create({
      data: product,
      include: { category: true },
    });
  }

  findById(id: number): Promise<Product> {
    return this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
  }

  update(id: number, product: CreateProductDto): Promise<Product> {
    return this.prisma.product.update({
      where: { id },
      data: product,
      include: { category: true },
    });
  }

  delete(id: number): Promise<Product> {
    return this.prisma.product.delete({
      where: { id },
      include: { category: true },
    });
  }

  async find(page: number, take: number): Promise<Pagination<Product[]>> {
    const totalOfItems = await this.prisma.product.count();

    const { nextSkip, nextPageUrl, prevPageUrl, totalOfPages } = getPagination({
      page,
      take,
      totalOfItems,
      route: '/product/find',
    });

    const results = await this.prisma.product.findMany({
      include: { category: true },
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
