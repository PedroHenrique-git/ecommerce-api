import { Injectable } from '@nestjs/common';
import { Cellphone, Prisma } from '@prisma/client';
import { PrismaService } from 'src/modules/common/database/prisma.service';
import { PaginationService } from 'src/modules/common/pagination/pagination.service';
import { Pagination } from 'src/shared/protocols/pagination.interface';
import { CreateCellphoneDto } from '../../dto/create-cellphone.dto';
import { UpdateCellphoneDto } from '../../dto/update-cellphone.dto';
import { CellphoneRepository } from '../cellphone.repository';

@Injectable()
export class PrismaCellphoneRepository extends CellphoneRepository {
  constructor(
    private prisma: PrismaService,
    private paginationService: PaginationService,
  ) {
    super();
  }

  create(cellphone: CreateCellphoneDto): Promise<Cellphone> {
    return this.prisma.cellphone.create({ data: cellphone });
  }

  update(id: number, cellphone: UpdateCellphoneDto): Promise<Cellphone> {
    return this.prisma.cellphone.update({ where: { id }, data: cellphone });
  }

  findById(id: number): Promise<Cellphone> {
    return this.prisma.cellphone.findUnique({
      where: { id },
    });
  }

  delete(id: number): Promise<Cellphone> {
    return this.prisma.cellphone.delete({
      where: { id },
    });
  }

  async find(
    page: number,
    take: number,
    sort: Prisma.SortOrder,
  ): Promise<Pagination<Cellphone[]>> {
    const totalOfItems = await this.prisma.cellphone.count();

    const { nextSkip, nextPageUrl, prevPageUrl, totalOfPages } =
      this.paginationService.getPagination({
        page,
        take,
        totalOfItems,
        route: '/cellphone',
      });

    const results = await this.prisma.cellphone.findMany({
      skip: nextSkip,
      take,
      orderBy: [{ id: sort }],
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
