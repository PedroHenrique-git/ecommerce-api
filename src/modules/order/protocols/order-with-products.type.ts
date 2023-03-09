import { Prisma } from '@prisma/client';

export type OrderWithProducts = Prisma.OrderGetPayload<{
  include: {
    client: true;
    ordersItems: { select: { orderItem: { include: { product: true } } } };
  };
}>;
