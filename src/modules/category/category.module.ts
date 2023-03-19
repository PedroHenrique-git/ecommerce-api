import { Module } from '@nestjs/common';
import { PrismaService } from '../common/database/prisma.service';
import { HandleErrorService } from '../common/handleError/handleError.service';
import { PaginationService } from '../common/pagination/pagination.service';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoryRepository } from './repository/category.repository';
import { PrismaCategoryRepository } from './repository/prisma/prisma.category.repository';

@Module({
  controllers: [CategoryController],
  providers: [
    PrismaService,
    CategoryService,
    PaginationService,
    HandleErrorService,
    { provide: CategoryRepository, useClass: PrismaCategoryRepository },
  ],
})
export class CategoryModule {}
