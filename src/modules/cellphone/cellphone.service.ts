import { Injectable } from '@nestjs/common';
import { CreateCellphoneDto } from './dto/create-cellphone.dto';
import { UpdateCellphoneDto } from './dto/update-cellphone.dto';
import { CellphoneRepository } from './repository/cellphone.repository';

@Injectable()
export class CellphoneService {
  constructor(private cellphoneRepository: CellphoneRepository) {}

  create(cellphone: CreateCellphoneDto) {
    return this.cellphoneRepository.create(cellphone);
  }

  findById(id: number) {
    return this.cellphoneRepository.findById(id);
  }

  update(id: number, cellphone: UpdateCellphoneDto) {
    return this.cellphoneRepository.update(id, cellphone);
  }

  delete(id: number) {
    return this.cellphoneRepository.delete(id);
  }

  find(page: number, take: number) {
    return this.cellphoneRepository.find(page, take);
  }
}
