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
import { ValidationSchemaPipe } from 'src/shared/pipes/validation-schema.pipe';
import { FileService } from '../common/file/file.service';
import { HandleErrorService } from '../common/handleError/handleError.service';
import { ImageService } from '../common/image/image.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CastFormDataPipe } from './pipes/cast-form-data.pipe';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(
    private productService: ProductService,
    private imageService: ImageService,
    private fileService: FileService,
    private handleErrorService: HandleErrorService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile()
    file: Express.Multer.File,
    @Body(CastFormDataPipe, ValidationSchemaPipe)
    productCategoryDto: CreateProductDto,
  ) {
    try {
      return await this.productService.create({
        ...productCategoryDto,
        image: this.imageService.generateImageUrl(file.filename),
      });
    } catch (err) {
      return this.handleErrorService.handlePrismaError(err);
    }
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile(new DefaultValuePipe(null))
    file: Express.Multer.File,
    @Body(CastFormDataPipe, ValidationSchemaPipe)
    updateProductDto: UpdateProductDto,
  ) {
    try {
      if (file) {
        const currentProduct = await this.productService.findById(id);

        if (!currentProduct) throw new Error('Record does not exists');

        const filename = this.fileService.extractFilenameFromUrl(
          currentProduct.image,
        );
        await this.fileService.deleteFile(`public/images/products/${filename}`);
      }

      const updatedProduct = await this.productService.update(id, {
        ...updateProductDto,
        ...(file
          ? { image: this.imageService.generateImageUrl(file.filename) }
          : {}),
      });

      return updatedProduct;
    } catch (err) {
      return this.handleErrorService.handlePrismaError(err);
    }
  }

  @Get('find/:id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.productService.findById(id);

      if (!result) {
        return this.handleErrorService.handleRecordNotFound('Product');
      }

      return result;
    } catch (err) {
      return this.handleErrorService.handlePrismaError(err);
    }
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    try {
      const removedProduct = await this.productService.delete(id);
      const filename = this.fileService.extractFilenameFromUrl(
        removedProduct.image,
      );

      await this.fileService.deleteFile(`public/images/products/${filename}`);

      return removedProduct;
    } catch (err) {
      return this.handleErrorService.handlePrismaError(err);
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
      return this.handleErrorService.handlePrismaError(err);
    }
  }
}
