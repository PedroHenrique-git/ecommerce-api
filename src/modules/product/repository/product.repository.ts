import { Prisma, Product } from '@prisma/client';
import { Pagination } from 'src/shared/protocols/pagination.interface';
import { CreateProductDto } from '../dto/create-product.dto';

export abstract class ProductRepository {
  abstract create(product: CreateProductDto): Promise<Product>;
  abstract findById(id: number): Promise<Product>;
  abstract find(
    page: number,
    take: number,
    sort: Prisma.SortOrder,
  ): Promise<Pagination<Product[]>>;
  abstract update(id: number, product: CreateProductDto): Promise<Product>;
  abstract delete(id: number): Promise<Product>;
}
