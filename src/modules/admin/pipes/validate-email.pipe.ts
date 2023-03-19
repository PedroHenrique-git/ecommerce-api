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
export class ValidateEmail implements PipeTransform<AdminDto, AdminDto> {
  constructor(private validationService: ValidationService) {}

  transform(value: AdminDto, { metatype }: ArgumentMetadata): AdminDto {
    const { email } = value;

    if (metatype.name === 'UpdateAdminDto' && !email) {
      return value;
    }

    if (this.validationService.isEmailValid(email)) {
      return value;
    }

    throw new BadRequestException('Invalid email');
  }
}
