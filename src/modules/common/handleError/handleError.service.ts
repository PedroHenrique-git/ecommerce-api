import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class HandleErrorService {
  handleError(err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          dbCode: err.code,
          meta: err.meta,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (err instanceof Prisma.PrismaClientUnknownRequestError) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          name: err.name,
          message: err.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (err instanceof HttpException) {
      throw new HttpException(
        {
          status: err.getStatus(),
          message: err.message,
        },
        err.getStatus(),
      );
    }

    throw new HttpException(
      {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: err.message,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
