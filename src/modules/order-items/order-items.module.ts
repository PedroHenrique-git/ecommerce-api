import { Module } from '@nestjs/common';
import { PrismaService } from '../common/database/prisma.service';
import { HandleErrorService } from '../common/handleError/handleError.service';
import { PaginationService } from '../common/pagination/pagination.service';
import { OrderItemsController } from './order-items.controller';
import { OrderItemsService } from './order-items.service';
import { OrderItemsRepository } from './repository/order-items.repository';
import { PrismaOrderItemsRepository } from './repository/prisma/prisma.order-items.repository';

@Module({
  controllers: [OrderItemsController],
  providers: [
    PrismaService,
    OrderItemsService,
    PaginationService,
    HandleErrorService,
    { provide: OrderItemsRepository, useClass: PrismaOrderItemsRepository },
  ],
})
export class OrderItemsModule {}
