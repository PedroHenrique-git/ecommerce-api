import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { isPasswordValid } from 'src/shared/helpers/validations/isPasswordValid';

import { CreateClientDto } from '../dto/create-client.dto';
import { UpdateClientDto } from '../dto/update-client.dto';

type ClientDto = CreateClientDto | UpdateClientDto;

@Injectable()
export class ValidatePassword implements PipeTransform<ClientDto, ClientDto> {
  transform(value: ClientDto, { metatype }: ArgumentMetadata): ClientDto {
    const { password } = value;

    if (metatype.name === 'UpdateClientDto' && !password) {
      return value;
    }

    if (isPasswordValid(password)) {
      return value;
    }

    throw new BadRequestException('Invalid password');
  }
}
