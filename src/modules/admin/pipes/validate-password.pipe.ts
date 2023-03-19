import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ValidationService } from 'src/modules/common/validation/validation.service';
import { CreateAdminDto } from '../dto/create-admin.dto';
import { UpdateAdminDto } from '../dto/update-admin.dto';

type AdminDto = CreateAdminDto | UpdateAdminDto;

@Injectable()
export class ValidatePassword implements PipeTransform<AdminDto, AdminDto> {
  constructor(private validationService: ValidationService) {}

  transform(value: AdminDto, { metatype }: ArgumentMetadata): AdminDto {
    const { password } = value;

    if (metatype.name === 'UpdateAdminDto' && !password) {
      return value;
    }

    if (this.validationService.isPasswordValid(password)) {
      return value;
    }

    throw new BadRequestException('Invalid password');
  }
}
