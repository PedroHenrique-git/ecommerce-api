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
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { HashPassword } from './pipes/hash-password.pipe';
import { ValidateEmail } from './pipes/validate-email.pipe';
import { ValidatePassword } from './pipes/validate-password.pipe';

@Controller('admin')
export class AdminController {
  constructor(
    private adminService: AdminService,
    private handleErrorService: HandleErrorService,
  ) {}

  @Post()
  async create(
    @Body(ValidationSchemaPipe, ValidateEmail, ValidatePassword, HashPassword)
    createAdminDto: CreateAdminDto,
  ) {
    try {
      return await this.adminService.create(createAdminDto);
    } catch (err) {
      return this.handleErrorService.handleError(err);
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationSchemaPipe, ValidateEmail, ValidatePassword, HashPassword)
    updateAdminDto: UpdateAdminDto,
  ) {
    try {
      return await this.adminService.update(id, updateAdminDto);
    } catch (err) {
      return this.handleErrorService.handleError(err);
    }
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.adminService.findById(id);

      if (!result) {
        throw new NotFoundException('Admin not found');
      }

      return result;
    } catch (err) {
      return this.handleErrorService.handleError(err);
    }
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.adminService.delete(id);
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
      return await this.adminService.find(page, take);
    } catch (err) {
      return this.handleErrorService.handleError(err);
    }
  }
}
