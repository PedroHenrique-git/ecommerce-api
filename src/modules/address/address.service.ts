import { Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { AddressRepository } from './repository/address.repository';

@Injectable()
export class AddressService {
  constructor(private addressRepository: AddressRepository) {}

  create(address: CreateAddressDto) {
    return this.addressRepository.create(address);
  }

  findById(id: number) {
    return this.addressRepository.findById(id);
  }

  update(id: number, address: UpdateAddressDto) {
    return this.addressRepository.update(id, address);
  }

  delete(id: number) {
    return this.addressRepository.delete(id);
  }

  find(page: number, take: number) {
    return this.addressRepository.find(page, take);
  }
}
