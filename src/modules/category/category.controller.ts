import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { DEFAULT_PAGE, DEFAULT_TAKE } from 'src/shared/constants';
import { handlePrismaError } from 'src/shared/helpers/general/handlePrismaError';
import { handleRecordNotFound } from 'src/shared/helpers/general/handleRecordNotFound';
import { ValidationSchemaPipe } from 'src/shared/pipes/validation-schema.pipe';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Post()
  async create(
    @Body(ValidationSchemaPipe) createCategoryDto: CreateCategoryDto,
  ) {
    try {
      return await this.categoryService.create(createCategoryDto);
    } catch (err) {
      return handlePrismaError(err);
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationSchemaPipe) updateCategoryDto: CreateCategoryDto,
  ) {
    try {
      return await this.categoryService.update(id, updateCategoryDto);
    } catch (err) {
      return handlePrismaError(err);
    }
  }

  @Get('find/:id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.categoryService.findById(id);

      if (!result) {
        return handleRecordNotFound('Category');
      }

      return result;
    } catch (err) {
      return handlePrismaError(err);
    }
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.categoryService.delete(id);
    } catch (err) {
      return handlePrismaError(err);
    }
  }

  @Get('find')
  async find(
    @Query('page', new DefaultValuePipe(DEFAULT_PAGE), ParseIntPipe)
    page: number,
    @Query('take', new DefaultValuePipe(DEFAULT_TAKE), ParseIntPipe)
    take: number,
  ) {
    try {
      return await this.categoryService.find(page, take);
    } catch (err) {
      return handlePrismaError(err);
    }
  }
}
