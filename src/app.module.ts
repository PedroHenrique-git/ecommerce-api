import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';
import { CategoryModule } from './modules/category/category.module';
import { ClientModule } from './modules/client/client.module';
import { OrderItemModule } from './modules/order-item/order-item.module';
import { OrderItemsModule } from './modules/order-items/order-items.module';
import { OrderModule } from './modules/order/order.module';
import { ProductModule } from './modules/product/product.module';
import configuration from './shared/config/configuration';

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    CategoryModule,
    ProductModule,
    OrderItemModule,
    OrderItemsModule,
    OrderModule,
    ClientModule,
    AuthModule,
  ],
})
export class AppModule {}
