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
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Controller('client')
export class ClientController {
  constructor(private clientService: ClientService) {}

  @Post()
  async create(@Body(ValidationSchemaPipe) createClientDto: CreateClientDto) {
    try {
      return await this.clientService.create(createClientDto);
    } catch (err) {
      return handlePrismaError(err);
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationSchemaPipe) updateClientDto: UpdateClientDto,
  ) {
    try {
      return await this.clientService.update(id, updateClientDto);
    } catch (err) {
      return handlePrismaError(err);
    }
  }

  @Get('find/:id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.clientService.findById(id);

      if (!result) {
        return handleRecordNotFound('Client');
      }

      return result;
    } catch (err) {
      return handlePrismaError(err);
    }
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.clientService.delete(id);
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
      return await this.clientService.find(page, take);
    } catch (err) {
      return handlePrismaError(err);
    }
  }
}
