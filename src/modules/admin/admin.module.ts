import { Module } from '@nestjs/common';
import { BcryptService } from '../common/bcrypt/bcrypt.service';
import { PrismaService } from '../common/database/prisma.service';
import { HandleErrorService } from '../common/handleError/handleError.service';
import { PaginationService } from '../common/pagination/pagination.service';
import { ValidationService } from '../common/validation/validation.service';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminRepository } from './repository/admin.repository';
import { PrismaAdminRepository } from './repository/prisma/prisma.admin.repository';

@Module({
  controllers: [AdminController],
  providers: [
    PrismaService,
    PaginationService,
    BcryptService,
    ValidationService,
    HandleErrorService,
    AdminService,
    { provide: AdminRepository, useClass: PrismaAdminRepository },
  ],
  exports: [AdminService],
})
export class AdminModule {}
