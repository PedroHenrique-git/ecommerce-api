import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { CategoryModule } from './modules/category/category.module';
import { ClientModule } from './modules/client/client.module';
import { OrderItemModule } from './modules/order-item/order-item.module';
import { OrderItemsModule } from './modules/order-items/order-items.module';
import { OrderModule } from './modules/order/order.module';
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
    OrderItemsModule,
    OrderModule,
    ClientModule,
  ],
})
export class AppModule {}
