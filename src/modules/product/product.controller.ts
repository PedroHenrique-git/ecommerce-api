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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DEFAULT_PAGE, DEFAULT_TAKE } from 'src/shared/constants';
import { generateImageUrl } from 'src/shared/helpers/generateImageUrl';
import { handlePrismaError } from 'src/shared/helpers/handlePrismaError';
import { handleRecordNotFound } from 'src/shared/helpers/handleRecordNotFound';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() productCategoryDto: CreateProductDto,
  ) {
    try {
      return await this.productService.create({
        ...productCategoryDto,
        image: generateImageUrl(file.filename),
        categoryId: Number(productCategoryDto.categoryId),
      });
    } catch (err) {
      return handlePrismaError(err);
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: CreateProductDto,
  ) {
    try {
      return await this.productService.update(id, updateProductDto);
    } catch (err) {
      return handlePrismaError(err);
    }
  }

  @Get('find/:id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.productService.findById(id);

      if (!result) {
        return handleRecordNotFound('Product');
      }

      return result;
    } catch (err) {
      return handlePrismaError(err);
    }
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.productService.delete(id);
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
      return await this.productService.find(page, take);
    } catch (err) {
      return handlePrismaError(err);
    }
  }
}
