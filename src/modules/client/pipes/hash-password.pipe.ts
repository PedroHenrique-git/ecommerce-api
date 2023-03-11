import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { NUMBER_OF_SALTS } from 'src/shared/constants';
import { CreateClientDto } from '../dto/create-client.dto';
import { UpdateClientDto } from '../dto/update-client.dto';

type ClientDto = CreateClientDto | UpdateClientDto;

@Injectable()
export class HashPassword
  implements PipeTransform<ClientDto, Promise<ClientDto>>
{
  async transform(
    value: ClientDto,
    { metatype }: ArgumentMetadata,
  ): Promise<ClientDto> {
    const { password } = value;

    if (metatype.name === 'UpdateClientDto' && !password) {
      return value;
    }

    value.password = await bcrypt.hash(password, NUMBER_OF_SALTS);

    return value;
  }
}
