import { Prisma } from '@prisma/client';

export type CategoryProducts = Prisma.CategoryGetPayload<{
  select: {
    products: {
      include: { orderItem: true };
    };
  };
}>;
