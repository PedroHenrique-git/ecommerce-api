import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { CategoryModule } from './modules/category/category.module';
import { OrderItemModule } from './modules/order-item/order-item.module';
import { ProductModule } from './modules/product/product.module';

@Module({
  controllers: [AppController],
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    CategoryModule,
    ProductModule,
    OrderItemModule,
  ],
})
export class AppModule {}
