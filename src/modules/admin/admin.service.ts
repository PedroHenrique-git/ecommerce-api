import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AdminRepository } from './repository/admin.repository';

@Injectable()
export class AdminService {
  constructor(private adminRepository: AdminRepository) {}

  create(admin: CreateAdminDto) {
    return this.adminRepository.create(admin);
  }

  findById(id: number) {
    return this.adminRepository.findById(id);
  }

  findByEmail(email: string) {
    return this.adminRepository.findByEmail(email);
  }

  update(id: number, admin: UpdateAdminDto) {
    return this.adminRepository.update(id, admin);
  }

  delete(id: number) {
    return this.adminRepository.delete(id);
  }

  find(page: number, take: number) {
    return this.adminRepository.find(page, take);
  }
}
