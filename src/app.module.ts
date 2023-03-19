import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AddressModule } from './modules/address/address.module';
import { AdminModule } from './modules/admin/admin.module';
import { AuthModule } from './modules/auth/auth.module';
import { CategoryModule } from './modules/category/category.module';
import { CellphoneModule } from './modules/cellphone/cellphone.module';
import { ClientModule } from './modules/client/client.module';
import { OrderItemModule } from './modules/order-item/order-item.module';
import { OrderItemsModule } from './modules/order-items/order-items.module';
import { OrderModule } from './modules/order/order.module';
import { ProductModule } from './modules/product/product.module';
import { TokenModule } from './modules/token/token.module';
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
    AdminModule,
    AddressModule,
    CellphoneModule,
    CategoryModule,
    ProductModule,
    OrderItemModule,
    OrderItemsModule,
    OrderModule,
    ClientModule,
    AuthModule,
    TokenModule,
  ],
})
export class AppModule {}
