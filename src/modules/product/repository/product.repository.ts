import { Pagination } from 'src/shared/interfaces/pagination.interface';
import { CreateProductDto } from '../dto/create-product.dto';
import { Product } from '../protocols/product.interface';

export abstract class ProductRepository {
  abstract create(product: CreateProductDto): Promise<Product>;
  abstract findById(id: number): Promise<Product>;
  abstract find(page: number, take: number): Promise<Pagination<Product[]>>;
  abstract update(id: number, product: CreateProductDto): Promise<Product>;
  abstract delete(id: number): Promise<Product>;
}
