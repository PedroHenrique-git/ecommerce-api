import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { DEFAULT_PAGE, DEFAULT_TAKE } from 'src/shared/constants';
import { handlePrismaError } from 'src/shared/helpers/handlePrismaError';
import { handleRecordNotFound } from 'src/shared/helpers/handleRecordNotFound';
import { ValidationSchemaPipe } from 'src/shared/pipes/validation-schema.pipe';
import { CreateOrderItemsDto } from './dto/create-order-items.dto';
import { UpdateOrderItemsDto } from './dto/update-order-items.dto';
import { OrderItemsService } from './order-items.service';

@Controller('order-items')
export class OrderItemsController {
  constructor(private orderItemsService: OrderItemsService) {}

  @Post()
  async create(
    @Body(ValidationSchemaPipe) createOrderItemsDto: CreateOrderItemsDto,
  ) {
    try {
      return await this.orderItemsService.create(createOrderItemsDto);
    } catch (err) {
      return handlePrismaError(err);
    }
  }

  @Patch(':orderId/:orderItemId')
  async update(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Param('orderItemId', ParseIntPipe) orderItemId: number,
    @Body(ValidationSchemaPipe) UpdateOrderItemsDto: UpdateOrderItemsDto,
  ) {
    try {
      return await this.orderItemsService.update(
        orderId,
        orderItemId,
        UpdateOrderItemsDto,
      );
    } catch (err) {
      return handlePrismaError(err);
    }
  }

  @Get('find/:orderId/:orderItemId')
  async findById(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Param('orderItemId', ParseIntPipe) orderItemId: number,
  ) {
    try {
      const result = await this.orderItemsService.findById(
        orderId,
        orderItemId,
      );

      if (!result) {
        return handleRecordNotFound('OrderItems');
      }

      return result;
    } catch (err) {
      return handlePrismaError(err);
    }
  }

  @Delete(':orderId/:orderItemId')
  async delete(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Param('orderItemId', ParseIntPipe) orderItemId: number,
  ) {
    try {
      return await this.orderItemsService.delete(orderId, orderItemId);
    } catch (err) {
      return handlePrismaError(err);
    }
  }

  @Get('find')
  async find(
    @Query('page', new DefaultValuePipe(DEFAULT_PAGE), ParseIntPipe)
    page: number,
    @Query('take', new DefaultValuePipe(DEFAULT_TAKE), ParseIntPipe)
    take: number,
  ) {
    try {
      return await this.orderItemsService.find(page, take);
    } catch (err) {
      return handlePrismaError(err);
    }
  }
}
