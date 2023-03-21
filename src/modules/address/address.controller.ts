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
import { Public } from '../auth/decorators/public-route.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { HandleErrorService } from '../common/handleError/handleError.service';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Controller('address')
export class AddressController {
  constructor(
    private addressService: AddressService,
    private handleErrorService: HandleErrorService,
  ) {}

  @Post()
  @Roles(Role.admin, Role.customer)
  @UseGuards(RolesGuard)
  async create(@Body(ValidationSchemaPipe) createAddressDto: CreateAddressDto) {
    try {
      return await this.addressService.create(createAddressDto);
    } catch (err) {
      return this.handleErrorService.handleError(err);
    }
  }

  @Patch(':id')
  @Roles(Role.admin, Role.customer)
  @UseGuards(RolesGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationSchemaPipe) updateAddressDto: UpdateAddressDto,
  ) {
    try {
      return await this.addressService.update(id, updateAddressDto);
    } catch (err) {
      return this.handleErrorService.handleError(err);
    }
  }

  @Public()
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.addressService.findById(id);

      if (!result) {
        throw new NotFoundException('Address not found');
      }

      return result;
    } catch (err) {
      return this.handleErrorService.handleError(err);
    }
  }

  @Delete(':id')
  @Roles(Role.admin, Role.customer)
  @UseGuards(RolesGuard)
  async delete(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.addressService.delete(id);
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
    @Query('sort', new DefaultValuePipe(DEFAULT_SORT))
    sort: Prisma.SortOrder,
  ) {
    try {
      return await this.addressService.find(page, take, sort);
    } catch (err) {
      return this.handleErrorService.handleError(err);
    }
  }
}
