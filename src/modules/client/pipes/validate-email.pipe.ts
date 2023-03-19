import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ValidationService } from 'src/modules/common/validation/validation.service';

import { CreateClientDto } from '../dto/create-client.dto';
import { UpdateClientDto } from '../dto/update-client.dto';

type ClientDto = CreateClientDto | UpdateClientDto;

@Injectable()
export class ValidateEmail implements PipeTransform<ClientDto, ClientDto> {
  constructor(private validationService: ValidationService) {}

  transform(value: ClientDto, { metatype }: ArgumentMetadata): ClientDto {
    const { email } = value;

    if (metatype.name === 'UpdateClientDto' && !email) {
      return value;
    }

    if (this.validationService.isEmailValid(email)) {
      return value;
    }

    throw new BadRequestException('Invalid email');
  }
}
