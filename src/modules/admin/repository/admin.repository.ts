import { Admin, Prisma } from '@prisma/client';
import { Pagination } from 'src/shared/protocols/pagination.interface';
import { CreateAdminDto } from '../dto/create-admin.dto';
import { UpdateAdminDto } from '../dto/update-admin.dto';

export abstract class AdminRepository {
  abstract create(admin: CreateAdminDto): Promise<Admin>;
  abstract findById(id: number): Promise<Admin>;
  abstract findByEmail(email: string): Promise<Admin>;
  abstract find(
    page: number,
    take: number,
    sort: Prisma.SortOrder,
  ): Promise<Pagination<Admin[]>>;
  abstract update(id: number, admin: UpdateAdminDto): Promise<Admin>;
  abstract delete(id: number): Promise<Admin>;
}
