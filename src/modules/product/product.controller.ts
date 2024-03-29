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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Prisma } from '@prisma/client';
import { DEFAULT_PAGE, DEFAULT_SORT, DEFAULT_TAKE } from 'src/shared/constants';
import { ValidationSchemaPipe } from 'src/shared/pipes/validation-schema.pipe';
import { Role } from 'src/shared/protocols/role.enum';
import { Public } from '../auth/decorators/public-route.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
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

  @Roles(Role.admin)
  @UseGuards(RolesGuard)
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
      return this.handleErrorService.handleError(err);
    }
  }

  @Roles(Role.admin)
  @UseGuards(RolesGuard)
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

        if (!currentProduct) throw new NotFoundException('Product not found');

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
      return this.handleErrorService.handleError(err);
    }
  }

  @Public()
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.productService.findById(id);

      if (!result) {
        throw new NotFoundException('Product not found');
      }

      return result;
    } catch (err) {
      return this.handleErrorService.handleError(err);
    }
  }

  @Roles(Role.admin)
  @UseGuards(RolesGuard)
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
    @Query('sort', new DefaultValuePipe(DEFAULT_SORT))
    sort: Prisma.SortOrder,
  ) {
    try {
      return await this.productService.find(page, take, sort);
    } catch (err) {
      return this.handleErrorService.handleError(err);
    }
  }
}
