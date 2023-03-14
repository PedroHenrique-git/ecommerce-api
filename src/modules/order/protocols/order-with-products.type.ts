import { Prisma } from '@prisma/client';

export type OrderWithProducts = Prisma.OrderGetPayload<{
  include: {
    client: false;
    ordersItems: { select: { orderItem: { include: { product: true } } } };
  };
}>;
