import { Order } from '@prisma/client';

export interface Client {
  name: string;
  address: string;
  email: string;
  password: string;
  cellphone: string;
  orders: Order[];
}
