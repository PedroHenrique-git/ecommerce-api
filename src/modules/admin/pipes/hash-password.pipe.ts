import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

import { BcryptService } from 'src/modules/common/bcrypt/bcrypt.service';
import { CreateAdminDto } from '../dto/create-admin.dto';
import { UpdateAdminDto } from '../dto/update-admin.dto';

type AdminDto = CreateAdminDto | UpdateAdminDto;

@Injectable()
export class HashPassword
  implements PipeTransform<AdminDto, Promise<AdminDto>>
{
  constructor(private bcryptService: BcryptService) {}

  async transform(
    value: AdminDto,
    { metatype }: ArgumentMetadata,
  ): Promise<AdminDto> {
    const { password } = value;

    if (metatype.name === 'UpdateAdminDto' && !password) {
      return value;
    }

    value.password = await this.bcryptService.hash(password);

    return value;
  }
}
