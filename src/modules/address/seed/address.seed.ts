import { faker } from '@faker-js/faker';
import { CreateAddressDto } from '../dto/create-address.dto';

export default function seederAddress(quantityOfAddresses: number) {
  const addresses: CreateAddressDto[] = [];

  for (let i = 1; i <= quantityOfAddresses; i++) {
    addresses.push({
      cep: faker.address.zipCode('######-##'),
      clientId: i,
      neighborhood: faker.address.street(),
      street: faker.address.street(),
    });
  }

  return addresses;
}
