import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import { NUMBER_OF_SALTS } from 'src/shared/constants';
import { CreateAdminDto } from '../dto/create-admin.dto';

export default function seederAdmin(quantityOfAdmins: number) {
  const admins: CreateAdminDto[] = [];

  for (let i = 1; i <= quantityOfAdmins; i++) {
    admins.push({
      email: faker.internet.email(),
      password: bcrypt.hashSync(faker.internet.password(), NUMBER_OF_SALTS),
    });
  }

  return admins;
}
