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
import { DEFAULT_PAGE, DEFAULT_TAKE } from 'src/shared/constants';
import { ValidationSchemaPipe } from 'src/shared/pipes/validation-schema.pipe';
import { Role } from 'src/shared/protocols/role.enum';
import { Public } from '../auth/decorators/public-route.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { HandleErrorService } from '../common/handleError/handleError.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(
    private orderService: OrderService,
    private handleErrorService: HandleErrorService,
  ) {}

  @Public()
  @Post()
  async create(@Body(ValidationSchemaPipe) createOrderDto: CreateOrderDto) {
    try {
      return await this.orderService.create(createOrderDto);
    } catch (err) {
      return this.handleErrorService.handleError(err);
    }
  }

  @Public()
  @Patch(':id')
  @Roles(Role.admin, Role.customer)
  @UseGuards(RolesGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationSchemaPipe) updateOrderDto: UpdateOrderDto,
  ) {
    try {
      return await this.orderService.update(id, updateOrderDto);
    } catch (err) {
      return this.handleErrorService.handleError(err);
    }
  }

  @Public()
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.orderService.findById(id);

      if (!result) {
        throw new NotFoundException('Order not found');
      }

      return result;
    } catch (err) {
      return this.handleErrorService.handleError(err);
    }
  }

  @Public()
  @Get(':id/order-items')
  async findOrderItemsByOrderId(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.orderService.findOrderItemsByOrderId(id);

      if (!result) {
        throw new NotFoundException('Order not found');
      }

      return result;
    } catch (err) {
      return this.handleErrorService.handleError(err);
    }
  }

  @Delete(':id')
  @Roles(Role.admin)
  @UseGuards(RolesGuard)
  async delete(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.orderService.delete(id);
    } catch (err) {
      return this.handleErrorService.handleError(err);
    }
  }

  @Public()
  @Get()
  async find(
    @Query('page', new DefaultValuePipe(DEFAULT_PAGE), ParseIntPipe)
    page: number,
    @Query('take', new DefaultValuePipe(DEFAULT_TAKE), ParseIntPipe)
    take: number,
  ) {
    try {
      return await this.orderService.find(page, take);
    } catch (err) {
      return this.handleErrorService.handleError(err);
    }
  }
}
