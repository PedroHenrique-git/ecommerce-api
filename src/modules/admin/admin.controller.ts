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
  @Roles(Role.admin)
  @UseGuards(RolesGuard)
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
  @Roles(Role.admin)
  @UseGuards(RolesGuard)
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
  @Roles(Role.admin)
  @UseGuards(RolesGuard)
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
  @Roles(Role.admin)
  @UseGuards(RolesGuard)
  async delete(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.adminService.delete(id);
    } catch (err) {
      return this.handleErrorService.handleError(err);
    }
  }

  @Get()
  @Roles(Role.admin)
  @UseGuards(RolesGuard)
  async find(
    @Query('page', new DefaultValuePipe(DEFAULT_PAGE), ParseIntPipe)
    page: number,
    @Query('take', new DefaultValuePipe(DEFAULT_TAKE), ParseIntPipe)
    take: number,
    @Query('sort', new DefaultValuePipe(DEFAULT_SORT), ParseIntPipe)
    sort: Prisma.SortOrder,
  ) {
    try {
      return await this.adminService.find(page, take, sort);
    } catch (err) {
      return this.handleErrorService.handleError(err);
    }
  }
}
