import { faker } from '@faker-js/faker';
import { CreateCategoryDto } from '../dto/create-category.dto';

export default function seederCategory(quantityOfCategories: number) {
  const categories: CreateCategoryDto[] = [];

  for (let i = 0; i < quantityOfCategories; i++) {
    categories.push({
      name: faker.commerce.department(),
    });
  }

  return categories;
}
