import { Cellphone } from '@prisma/client';
import { Pagination } from 'src/shared/interfaces/pagination.interface';
import { CreateCellphoneDto } from '../dto/create-cellphone.dto';
import { UpdateCellphoneDto } from '../dto/update-cellphone.dto';

export abstract class CellphoneRepository {
  abstract create(cellphone: CreateCellphoneDto): Promise<Cellphone>;
  abstract findById(id: number): Promise<Cellphone>;
  abstract find(page: number, take: number): Promise<Pagination<Cellphone[]>>;
  abstract update(
    id: number,
    cellphone: UpdateCellphoneDto,
  ): Promise<Cellphone>;
  abstract delete(id: number): Promise<Cellphone>;
}
