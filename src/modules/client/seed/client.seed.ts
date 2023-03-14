import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import { NUMBER_OF_SALTS } from 'src/shared/constants';
import { CreateClientDto } from '../dto/create-client.dto';

export default function seederClient(quantityOfClients: number) {
  const clients: CreateClientDto[] = [];

  for (let i = 1; i <= quantityOfClients; i++) {
    clients.push({
      provider: '',
      providerId: '',
      email: faker.internet.email(),
      name: faker.name.fullName(),
      password: bcrypt.hashSync(faker.internet.password(), NUMBER_OF_SALTS),
    });
  }

  return clients;
}
