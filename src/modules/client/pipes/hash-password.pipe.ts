import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

import { BcryptService } from 'src/modules/common/bcrypt/bcrypt.service';
import { CreateClientDto } from '../dto/create-client.dto';
import { UpdateClientDto } from '../dto/update-client.dto';

type ClientDto = CreateClientDto | UpdateClientDto;

@Injectable()
export class HashPassword
  implements PipeTransform<ClientDto, Promise<ClientDto>>
{
  constructor(private bcryptService: BcryptService) {}

  async transform(
    value: ClientDto,
    { metatype }: ArgumentMetadata,
  ): Promise<ClientDto> {
    const { password } = value;

    if (metatype.name === 'UpdateClientDto' && !password) {
      return value;
    }

    value.password = await this.bcryptService.hash(password);

    return value;
  }
}
