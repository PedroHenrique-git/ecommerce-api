import { Category, Prisma } from '@prisma/client';
import { getPagination } from 'src/shared/helpers/pagination';
import { Pagination } from 'src/shared/interfaces/pagination.interface';
import { CreateProductDto } from '../../dto/create-product.dto';
import { UpdateProductDto } from '../../dto/update-product.dto';
import { Product } from '../../protocols/product.interface';
import { ProductRepository } from '../product.repository';

export class InMemoryProductRepository extends ProductRepository {
  private products: Product[] = [];

  private getNextId() {
    const lastIndex = this.products.length;

    return lastIndex === 0 ? 1 : lastIndex + 1;
  }

  create(product: CreateProductDto): Promise<Product> {
    const length = this.products.push({
      id: this.getNextId(),
      ...product,
      price: new Prisma.Decimal(product.price),
      category: {} as Category,
    });

    return Promise.resolve(this.products[length - 1]);
  }

  delete(id: number): Promise<Product> {
    const index = this.products.findIndex((c) => c.id === id);
    const product = this.products[index];

    this.products = this.products.filter((c) => c.id !== id);

    if (!product) {
      throw new Error('Record not found');
    }

    return Promise.resolve(product);
  }

  findById(id: number): Promise<Product> {
    return Promise.resolve(this.products.find((p) => p.id === id));
  }

  update(id: number, product: UpdateProductDto): Promise<Product> {
    let index = -1;

    const newProducts = this.products.map((c, i) => {
      if (c.id === id) {
        index = i;

        return {
          ...c,
          ...product,
          price: new Prisma.Decimal(product.price),
        };
      }

      return c;
    });

    if (index === -1) {
      throw new Error('Record not found');
    }

    return Promise.resolve(newProducts[index]);
  }

  find(page: number, take: number): Promise<Pagination<Product[]>> {
    const totalOfItems = this.products.length;

    const { nextSkip, nextPageUrl, prevPageUrl, totalOfPages } = getPagination({
      page,
      take,
      totalOfItems,
      route: '/product/find',
    });

    const results = this.products.slice(nextSkip, page * take);

    return Promise.resolve({
      info: {
        nextPageUrl,
        prevPageUrl,
        totalOfItems,
        totalOfPages,
      },
      results,
    });
  }
}
