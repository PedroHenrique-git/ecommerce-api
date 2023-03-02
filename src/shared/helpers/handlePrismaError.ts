import { Prisma } from '@prisma/client';

type Error = { error: boolean; message: string };

export function handlePrismaError(err: any): Error {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    return { message: String(err.meta.cause), error: true };
  }

  if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    return { message: String(err.name), error: true };
  }

  return { message: String(err.message), error: true };
}
