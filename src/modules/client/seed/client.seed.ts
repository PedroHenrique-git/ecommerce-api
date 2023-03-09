import { faker } from '@faker-js/faker';
import { CreateClientDto } from '../dto/create-client.dto';

export default function seederClient(quantityOfClients: number) {
  const clients: CreateClientDto[] = [];

  for (let i = 1; i <= quantityOfClients; i++) {
    clients.push({
      address: faker.address.streetAddress(),
      cellphone: faker.phone.number(),
      email: faker.internet.email(),
      name: faker.name.fullName(),
      password: faker.internet.password(),
    });
  }

  return clients;
}
