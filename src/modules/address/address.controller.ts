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
  async create(@Body(ValidationSchemaPipe) createAddressDto: CreateAddressDto) {
    try {
      return await this.addressService.create(createAddressDto);
    } catch (err) {
      return this.handleErrorService.handleError(err);
    }
  }

  @Patch(':id')
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

  @Get('find/:id')
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
  async delete(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.addressService.delete(id);
    } catch (err) {
      return this.handleErrorService.handleError(err);
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
      return await this.addressService.find(page, take);
    } catch (err) {
      return this.handleErrorService.handleError(err);
    }
  }
}
