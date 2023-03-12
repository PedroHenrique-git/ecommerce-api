import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { PrismaService } from '../common/database/prisma.service';
import { FileService } from '../common/file/file.service';
import { HandleErrorService } from '../common/handleError/handleError.service';
import { ImageService } from '../common/image/image.service';
import { PaginationService } from '../common/pagination/pagination.service';
import { multerConfig } from './config/multer.config';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { PrismaProductRepository } from './repository/prisma/prisma.product.repository';
import { ProductRepository } from './repository/product.repository';

@Module({
  imports: [MulterModule.register(multerConfig)],
  controllers: [ProductController],
  providers: [
    PrismaService,
    ProductService,
    PaginationService,
    ImageService,
    FileService,
    HandleErrorService,
    { provide: ProductRepository, useClass: PrismaProductRepository },
  ],
})
export class ProductModule {}
