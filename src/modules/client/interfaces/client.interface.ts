import { Order } from '@prisma/client';

export interface Client {
  id: number;
  name: string;
  address: string;
  email: string;
  password: string;
  cellphone: string;
  orders: Order[];
}
