import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductRepository } from './repository/product.repository';

@Injectable()
export class ProductService {
  constructor(private productRepository: ProductRepository) {}

  create(product: CreateProductDto) {
    return this.productRepository.create(product);
  }

  findById(id: number) {
    return this.productRepository.findById(id);
  }

  update(id: number, product: CreateProductDto) {
    return this.productRepository.update(id, product);
  }

  delete(id: number) {
    return this.productRepository.delete(id);
  }

  find(page: number, take: number, sort: Prisma.SortOrder) {
    return this.productRepository.find(page, take, sort);
  }
}
