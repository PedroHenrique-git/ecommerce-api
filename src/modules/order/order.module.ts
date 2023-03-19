import { Module } from '@nestjs/common';
import { PrismaService } from '../common/database/prisma.service';
import { HandleErrorService } from '../common/handleError/handleError.service';
import { PaginationService } from '../common/pagination/pagination.service';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderRepository } from './repository/order.repository';
import { PrismaOrderRepository } from './repository/prisma/prisma.order.repository';

@Module({
  controllers: [OrderController],
  providers: [
    PrismaService,
    OrderService,
    PaginationService,
    HandleErrorService,
    { provide: OrderRepository, useClass: PrismaOrderRepository },
  ],
})
export class OrderModule {}
