import { Address, Prisma } from '@prisma/client';
import { Pagination } from 'src/shared/protocols/pagination.interface';
import { CreateAddressDto } from '../dto/create-address.dto';
import { UpdateAddressDto } from '../dto/update-address.dto';

export abstract class AddressRepository {
  abstract create(address: CreateAddressDto): Promise<Address>;
  abstract findById(id: number): Promise<Address>;
  abstract find(
    page: number,
    take: number,
    sort: Prisma.SortOrder,
  ): Promise<Pagination<Address[]>>;
  abstract update(id: number, address: UpdateAddressDto): Promise<Address>;
  abstract delete(id: number): Promise<Address>;
}
