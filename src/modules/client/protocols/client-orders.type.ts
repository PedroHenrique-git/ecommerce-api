import { Prisma } from '@prisma/client';

export type ClientOrders = Prisma.ClientGetPayload<{
  select: {
    orders: {
      include: {
        ordersItems: { include: { orderItem: { include: { product: true } } } };
      };
    };
  };
}>;
