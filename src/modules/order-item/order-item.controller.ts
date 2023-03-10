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
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { OrderItemService } from './order-item.service';

@Controller('order-item')
export class OrderItemController {
  constructor(private orderItemService: OrderItemService) {}

  @Post()
  async create(
    @Body(ValidationSchemaPipe) createOrderItemDto: CreateOrderItemDto,
  ) {
    try {
      return await this.orderItemService.create(createOrderItemDto);
    } catch (err) {
      return handlePrismaError(err);
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationSchemaPipe) updateOrderItemDto: UpdateOrderItemDto,
  ) {
    try {
      return await this.orderItemService.update(id, updateOrderItemDto);
    } catch (err) {
      return handlePrismaError(err);
    }
  }

  @Get('find/:id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.orderItemService.findById(id);

      if (!result) {
        return handleRecordNotFound('OrderItem');
      }

      return result;
    } catch (err) {
      return handlePrismaError(err);
    }
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.orderItemService.delete(id);
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
      return await this.orderItemService.find(page, take);
    } catch (err) {
      return handlePrismaError(err);
    }
  }
}
