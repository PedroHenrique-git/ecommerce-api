import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { isEmailValid } from 'src/shared/helpers/validations/isEmailValid';

import { CreateClientDto } from '../dto/create-client.dto';
import { UpdateClientDto } from '../dto/update-client.dto';

type ClientDto = CreateClientDto | UpdateClientDto;

@Injectable()
export class ValidateEmail implements PipeTransform<ClientDto, ClientDto> {
  transform(value: ClientDto, { metatype }: ArgumentMetadata): ClientDto {
    const { email } = value;

    if (metatype.name === 'UpdateClientDto' && !email) {
      return value;
    }

    if (isEmailValid(email)) {
      return value;
    }

    throw new BadRequestException('Invalid email');
  }
}
