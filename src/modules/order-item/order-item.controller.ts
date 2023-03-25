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
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { OrderItemService } from './order-item.service';

@Controller('order-item')
export class OrderItemController {
  constructor(
    private orderItemService: OrderItemService,
    private handleErrorService: HandleErrorService,
  ) {}

  @Roles(Role.admin)
  @UseGuards(RolesGuard)
  @Post()
  async create(
    @Body(ValidationSchemaPipe) createOrderItemDto: CreateOrderItemDto,
  ) {
    try {
      return await this.orderItemService.create(createOrderItemDto);
    } catch (err) {
      return this.handleErrorService.handleError(err);
    }
  }

  @Roles(Role.admin)
  @UseGuards(RolesGuard)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationSchemaPipe) updateOrderItemDto: UpdateOrderItemDto,
  ) {
    try {
      return await this.orderItemService.update(id, updateOrderItemDto);
    } catch (err) {
      return this.handleErrorService.handleError(err);
    }
  }

  @Roles(Role.admin)
  @UseGuards(RolesGuard)
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.orderItemService.findById(id);

      if (!result) {
        throw new NotFoundException('OrderItem not found');
      }

      return result;
    } catch (err) {
      return this.handleErrorService.handleError(err);
    }
  }

  @Roles(Role.admin)
  @UseGuards(RolesGuard)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.orderItemService.delete(id);
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
      return await this.orderItemService.find(page, take, sort);
    } catch (err) {
      return this.handleErrorService.handleError(err);
    }
  }
}
