import { Module } from '@nestjs/common';
import { PrismaService } from '../common/database/prisma.service';
import { HandleErrorService } from '../common/handleError/handleError.service';
import { PaginationService } from '../common/pagination/pagination.service';
import { CellphoneController } from './cellphone.controller';
import { CellphoneService } from './cellphone.service';
import { CellphoneRepository } from './repository/cellphone.repository';
import { PrismaCellphoneRepository } from './repository/prisma/prisma.cellphone.repository';

@Module({
  controllers: [CellphoneController],
  providers: [
    PrismaService,
    CellphoneService,
    PaginationService,
    HandleErrorService,
    { provide: CellphoneRepository, useClass: PrismaCellphoneRepository },
  ],
})
export class CellphoneModule {}
