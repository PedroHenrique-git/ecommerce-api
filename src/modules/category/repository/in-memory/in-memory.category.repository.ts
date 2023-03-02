import { getPagination } from 'src/shared/helpers/pagination';
import { Pagination } from 'src/shared/interfaces/pagination.interface';
import { CreateCategoryDto } from '../../dto/create-category.dto';
import { Category } from '../../interfaces/category.interface';
import { CategoryRepository } from '../category.repository';

export class InMemoryCategoryRepository implements CategoryRepository {
  private categories: Category[] = [];

  private getNextId() {
    const lastIndex = this.categories.length;

    return lastIndex === 0 ? 1 : lastIndex + 1;
  }

  create(category: CreateCategoryDto): Promise<Category> {
    const length = this.categories.push({
      id: this.getNextId(),
      products: [],
      ...category,
    });

    return Promise.resolve(this.categories[length - 1]);
  }

  delete(id: number): Promise<Category> {
    const index = this.categories.findIndex((c) => c.id === id);
    const category = this.categories[index];

    this.categories = this.categories.filter((c) => c.id !== id);

    if (!category) {
      throw new Error('Record not found');
    }

    return Promise.resolve(category);
  }

  findById(id: number): Promise<Category> {
    return Promise.resolve(this.categories.find((c) => c.id === id));
  }

  update(id: number, category: CreateCategoryDto): Promise<Category> {
    let index = -1;

    const newCategories = this.categories.map((c, i) => {
      if (c.id === id) {
        index = i;

        return {
          ...c,
          ...category,
        };
      }

      return c;
    });

    if (index === -1) {
      throw new Error('Record not found');
    }

    return Promise.resolve(newCategories[index]);
  }

  find(page: number, take: number): Promise<Pagination<Category[]>> {
    const totalOfItems = this.categories.length;

    const { nextSkip, nextPageUrl, prevPageUrl, totalOfPages } = getPagination({
      page,
      take,
      totalOfItems,
      route: '/category/find',
    });

    const results = this.categories.slice(nextSkip, page * take);

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
