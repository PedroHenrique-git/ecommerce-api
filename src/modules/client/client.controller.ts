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
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { HashPassword } from './pipes/hash-password.pipe';
import { ValidateEmail } from './pipes/validate-email.pipe';
import { ValidatePassword } from './pipes/validate-password.pipe';

@Controller('client')
export class ClientController {
  constructor(
    private clientService: ClientService,
    private handleErrorService: HandleErrorService,
  ) {}

  @Post()
  async create(
    @Body(ValidationSchemaPipe, ValidateEmail, ValidatePassword, HashPassword)
    createClientDto: CreateClientDto,
  ) {
    try {
      return await this.clientService.create(createClientDto);
    } catch (err) {
      return this.handleErrorService.handleError(err);
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationSchemaPipe, ValidateEmail, ValidatePassword, HashPassword)
    updateClientDto: UpdateClientDto,
  ) {
    try {
      return await this.clientService.update(id, updateClientDto);
    } catch (err) {
      return this.handleErrorService.handleError(err);
    }
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.clientService.findById(id);

      if (!result) {
        throw new NotFoundException('Client not found');
      }

      return result;
    } catch (err) {
      return this.handleErrorService.handleError(err);
    }
  }

  @Get(':id/orders')
  async findClientOrderById(@Param('id', ParseIntPipe) id: number) {
    try {
      const results = await this.clientService.findClientOrdersById(id);

      if (!results) {
        throw new NotFoundException('Client not found');
      }

      return results;
    } catch (err) {
      return this.handleErrorService.handleError(err);
    }
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.clientService.delete(id);
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
      return await this.clientService.find(page, take);
    } catch (err) {
      return this.handleErrorService.handleError(err);
    }
  }
}
