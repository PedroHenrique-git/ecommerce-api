import { faker } from '@faker-js/faker';
import { CreateCellphoneDto } from '../dto/create-cellphone.dto';

export default function seederCellphone(quantityOfCellphones: number) {
  const cellphones: CreateCellphoneDto[] = [];

  for (let i = 1; i <= quantityOfCellphones; i++) {
    cellphones.push({
      clientId: i,
      cellphone: faker.phone.number('(##) #####-####'),
    });
  }

  return cellphones;
}
