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
import { CellphoneService } from './cellphone.service';
import { CreateCellphoneDto } from './dto/create-cellphone.dto';
import { UpdateCellphoneDto } from './dto/update-cellphone.dto';

@Controller('cellphone')
export class CellphoneController {
  constructor(
    private cellphoneService: CellphoneService,
    private handleErrorService: HandleErrorService,
  ) {}

  @Post()
  async create(
    @Body(ValidationSchemaPipe) createCellphoneDto: CreateCellphoneDto,
  ) {
    try {
      return await this.cellphoneService.create(createCellphoneDto);
    } catch (err) {
      return this.handleErrorService.handleError(err);
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationSchemaPipe) updateCellphoneDto: UpdateCellphoneDto,
  ) {
    try {
      return await this.cellphoneService.update(id, updateCellphoneDto);
    } catch (err) {
      return this.handleErrorService.handleError(err);
    }
  }

  @Get('find/:id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.cellphoneService.findById(id);

      if (!result) {
        throw new NotFoundException('Cellphone not found');
      }

      return result;
    } catch (err) {
      return this.handleErrorService.handleError(err);
    }
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.cellphoneService.delete(id);
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
      return await this.cellphoneService.find(page, take);
    } catch (err) {
      return this.handleErrorService.handleError(err);
    }
  }
}
