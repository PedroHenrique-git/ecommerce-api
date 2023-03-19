import { Injectable } from '@nestjs/common';
import { Admin } from '@prisma/client';
import { PrismaService } from 'src/modules/common/database/prisma.service';
import { PaginationService } from 'src/modules/common/pagination/pagination.service';
import { Pagination } from 'src/shared/protocols/pagination.interface';
import { CreateAdminDto } from '../../dto/create-admin.dto';
import { UpdateAdminDto } from '../../dto/update-admin.dto';
import { AdminRepository } from '../admin.repository';

@Injectable()
export class PrismaAdminRepository extends AdminRepository {
  constructor(
    private prisma: PrismaService,
    private paginationService: PaginationService,
  ) {
    super();
  }

  create(admin: CreateAdminDto): Promise<Admin> {
    return this.prisma.admin.create({ data: admin });
  }

  update(id: number, admin: UpdateAdminDto): Promise<Admin> {
    return this.prisma.admin.update({ where: { id }, data: admin });
  }

  findById(id: number): Promise<Admin> {
    return this.prisma.admin.findUnique({
      where: { id },
    });
  }

  findByEmail(email: string): Promise<Admin> {
    return this.prisma.admin.findUnique({
      where: { email },
    });
  }

  delete(id: number): Promise<Admin> {
    return this.prisma.admin.delete({
      where: { id },
    });
  }

  async find(page: number, take: number): Promise<Pagination<Admin[]>> {
    const totalOfItems = await this.prisma.admin.count();

    const { nextSkip, nextPageUrl, prevPageUrl, totalOfPages } =
      this.paginationService.getPagination({
        page,
        take,
        totalOfItems,
        route: '/admin',
      });

    const results = await this.prisma.admin.findMany({
      skip: nextSkip,
      take,
    });

    return {
      info: {
        nextPageUrl,
        prevPageUrl,
        totalOfItems,
        totalOfPages,
      },
      results,
    };
  }
}
