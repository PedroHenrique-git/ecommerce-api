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
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  async create(@Body(ValidationSchemaPipe) createOrderDto: CreateOrderDto) {
    try {
      return await this.orderService.create(createOrderDto);
    } catch (err) {
      return handlePrismaError(err);
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationSchemaPipe) updateOrderDto: UpdateOrderDto,
  ) {
    try {
      return await this.orderService.update(id, updateOrderDto);
    } catch (err) {
      return handlePrismaError(err);
    }
  }

  @Get('find/:id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.orderService.findById(id);

      if (!result) {
        return handleRecordNotFound('Order');
      }

      return result;
    } catch (err) {
      return handlePrismaError(err);
    }
  }

  @Get('find/order-items/:id')
  async findOrderItemsByOrderId(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.orderService.findOrderItemsByOrderId(id);

      if (!result) {
        return handleRecordNotFound('Order');
      }

      return result;
    } catch (err) {
      return handlePrismaError(err);
    }
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.orderService.delete(id);
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
      return await this.orderService.find(page, take);
    } catch (err) {
      return handlePrismaError(err);
    }
  }
}
