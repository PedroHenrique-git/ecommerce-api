import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { DEFAULT_PAGE, DEFAULT_TAKE } from 'src/shared/constants';
import { ValidationSchemaPipe } from 'src/shared/pipes/validation-schema.pipe';
import { HandleErrorService } from '../common/handleError/handleError.service';
import { CreateOrderItemsDto } from './dto/create-order-items.dto';
import { UpdateOrderItemsDto } from './dto/update-order-items.dto';
import { OrderItemsService } from './order-items.service';

@Controller('order-items')
export class OrderItemsController {
  constructor(
    private orderItemsService: OrderItemsService,
    private handleErrorService: HandleErrorService,
  ) {}

  @Post()
  async create(
    @Body(ValidationSchemaPipe) createOrderItemsDto: CreateOrderItemsDto,
  ) {
    try {
      return await this.orderItemsService.create(createOrderItemsDto);
    } catch (err) {
      return this.handleErrorService.handleError(err);
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
      return this.handleErrorService.handleError(err);
    }
  }

  @Get(':orderId/:orderItemId')
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
        throw new NotFoundException('OrderItems not found');
      }

      return result;
    } catch (err) {
      return this.handleErrorService.handleError(err);
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
      return this.handleErrorService.handleError(err);
    }
  }

  @Get()
  async find(
    @Query('page', new DefaultValuePipe(DEFAULT_PAGE), ParseIntPipe)
    page: number,
    @Query('take', new DefaultValuePipe(DEFAULT_TAKE), ParseIntPipe)
    take: number,
  ) {
    try {
      return await this.orderItemsService.find(page, take);
    } catch (err) {
      return this.handleErrorService.handleError(err);
    }
  }
}
