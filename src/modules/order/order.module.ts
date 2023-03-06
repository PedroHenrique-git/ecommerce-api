import { Module } from '@nestjs/common';
import { PrismaService } from '../common/database/prisma.service';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderRepository } from './repository/order.repository';
import { PrismaOrderRepository } from './repository/prisma/prisma.order.repository';

@Module({
  controllers: [OrderController],
  providers: [
    PrismaService,
    OrderService,
    { provide: OrderRepository, useClass: PrismaOrderRepository },
  ],
})
export class OrderModule {}
