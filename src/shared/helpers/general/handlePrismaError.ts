import { Prisma } from '@prisma/client';
import { DEFAULT_ERROR_MESSAGE } from '../../constants';

type Error = { error: boolean; message: string };

export function handlePrismaError(err: any): Error {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    return {
      message: String(err.meta.cause ?? DEFAULT_ERROR_MESSAGE),
      error: true,
    };
  }

  if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    return { message: String(err.name ?? DEFAULT_ERROR_MESSAGE), error: true };
  }

  return { message: String(err.message ?? DEFAULT_ERROR_MESSAGE), error: true };
}
