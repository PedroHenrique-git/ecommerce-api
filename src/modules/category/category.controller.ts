import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DEFAULT_PAGE, DEFAULT_TAKE } from 'src/shared/constants';

import { ValidationSchemaPipe } from 'src/shared/pipes/validation-schema.pipe';
import { Role } from 'src/shared/protocols/role.enum';
import { Public } from '../auth/decorators/public-route.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { HandleErrorService } from '../common/handleError/handleError.service';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('category')
export class CategoryController {
  constructor(
    private categoryService: CategoryService,
    private handleErrorService: HandleErrorService,
  ) {}

  @Post()
  @Roles(Role.admin)
  @UseGuards(RolesGuard)
  async create(
    @Body(ValidationSchemaPipe) createCategoryDto: CreateCategoryDto,
  ) {
    try {
      return await this.categoryService.create(createCategoryDto);
    } catch (err) {
      return this.handleErrorService.handleError(err);
    }
  }

  @Patch(':id')
  @Roles(Role.admin)
  @UseGuards(RolesGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationSchemaPipe) updateCategoryDto: CreateCategoryDto,
  ) {
    try {
      return await this.categoryService.update(id, updateCategoryDto);
    } catch (err) {
      return this.handleErrorService.handleError(err);
    }
  }

  @Public()
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.categoryService.findById(id);

      if (!result) {
        throw new NotFoundException('Category not found');
      }

      return result;
    } catch (err) {
      return this.handleErrorService.handleError(err);
    }
  }

  @Public()
  @Get(':id/products')
  async findProductsById(@Param('id', ParseIntPipe) id: number) {
    try {
      const results = await this.categoryService.findProductsById(id);

      if (!results) {
        throw new NotFoundException('Category not found');
      }

      return results;
    } catch (err) {
      return this.handleErrorService.handleError(err);
    }
  }

  @Delete(':id')
  @Roles(Role.admin)
  @UseGuards(RolesGuard)
  async delete(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.categoryService.delete(id);
    } catch (err) {
      return this.handleErrorService.handleError(err);
    }
  }

  @Public()
  @Get()
  async find(
    @Query('page', new DefaultValuePipe(DEFAULT_PAGE), ParseIntPipe)
    page: number,
    @Query('take', new DefaultValuePipe(DEFAULT_TAKE), ParseIntPipe)
    take: number,
  ) {
    try {
      return await this.categoryService.find(page, take);
    } catch (err) {
      return this.handleErrorService.handleError(err);
    }
  }
}
