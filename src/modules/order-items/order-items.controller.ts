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
  UseGuards,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DEFAULT_PAGE, DEFAULT_SORT, DEFAULT_TAKE } from 'src/shared/constants';
import { ValidationSchemaPipe } from 'src/shared/pipes/validation-schema.pipe';
import { Role } from 'src/shared/protocols/role.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
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

  @Roles(Role.admin)
  @UseGuards(RolesGuard)
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

  @Roles(Role.admin)
  @UseGuards(RolesGuard)
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

  @Roles(Role.admin)
  @UseGuards(RolesGuard)
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

  @Roles(Role.admin)
  @UseGuards(RolesGuard)
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

  @Roles(Role.admin)
  @UseGuards(RolesGuard)
  @Get()
  async find(
    @Query('page', new DefaultValuePipe(DEFAULT_PAGE), ParseIntPipe)
    page: number,
    @Query('take', new DefaultValuePipe(DEFAULT_TAKE), ParseIntPipe)
    take: number,
    @Query('sort', new DefaultValuePipe(DEFAULT_SORT))
    sort: Prisma.SortOrder,
  ) {
    try {
      return await this.orderItemsService.find(page, take, sort);
    } catch (err) {
      return this.handleErrorService.handleError(err);
    }
  }
}
