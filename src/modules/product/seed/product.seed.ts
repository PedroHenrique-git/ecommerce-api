import { faker } from '@faker-js/faker';
import { CreateProductDto } from '../dto/create-product.dto';

export default function seederProduct(
  quantityOfProducts: number,
  minIdCategory = 1,
  maxIdCategory = 3,
) {
  const products: CreateProductDto[] = [];

  for (let i = 0; i < quantityOfProducts; i++) {
    products.push({
      categoryId: faker.datatype.number({
        min: minIdCategory,
        max: maxIdCategory,
      }),
      image: faker.image.abstract(),
      name: faker.commerce.productName(),
      price: faker.datatype.number({ min: 100, max: 1000, precision: 2 }),
    });
  }

  return products;
}
