import { Client, OrderItems } from '@prisma/client';

export interface Order {
  id: number;
  status: string;
  client: Client;
  clientId: number;
  ordersItems: OrderItems[];
}
