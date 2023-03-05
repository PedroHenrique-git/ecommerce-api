import { Module } from '@nestjs/common';
import { PrismaService } from '../common/database/prisma.service';
import { OrderItemController } from './order-item.controller';
import { OrderItemService } from './order-item.service';
import { OrderItemRepository } from './repository/order-item.repository';
import { PrismaOrderItemRepository } from './repository/prisma/prisma.order-item.repository';

@Module({
  controllers: [OrderItemController],
  providers: [
    PrismaService,
    OrderItemService,
    { provide: OrderItemRepository, useClass: PrismaOrderItemRepository },
  ],
})
export class OrderItemModule {}
