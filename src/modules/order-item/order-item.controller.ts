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
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { OrderItemService } from './order-item.service';

@Controller('order-item')
export class OrderItemController {
  constructor(
    private orderItemService: OrderItemService,
    private handleErrorService: HandleErrorService,
  ) {}

  @Post()
  @Roles(Role.admin)
  @UseGuards(RolesGuard)
  async create(
    @Body(ValidationSchemaPipe) createOrderItemDto: CreateOrderItemDto,
  ) {
    try {
      return await this.orderItemService.create(createOrderItemDto);
    } catch (err) {
      return this.handleErrorService.handleError(err);
    }
  }

  @Patch(':id')
  @Roles(Role.admin)
  @UseGuards(RolesGuard)
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

  @Public()
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

  @Delete(':id')
  @Roles(Role.admin)
  @UseGuards(RolesGuard)
  async delete(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.orderItemService.delete(id);
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
      return await this.orderItemService.find(page, take);
    } catch (err) {
      return this.handleErrorService.handleError(err);
    }
  }
}
