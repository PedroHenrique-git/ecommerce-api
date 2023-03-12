import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';

type Error = { error: boolean; message: string };

@Injectable()
export class HandleErrorService {
  constructor(private configService: ConfigService) {}

  handleRecordNotFound(controllerName: string) {
    return { message: `${controllerName} does not exist` };
  }

  handlePrismaError(err: any): Error {
    const defaultErrorMessage = this.configService.get('general.errorMessage');

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return {
        message: String(err.meta.cause ?? defaultErrorMessage),
        error: true,
      };
    }

    if (err instanceof Prisma.PrismaClientUnknownRequestError) {
      return {
        message: String(err.name ?? defaultErrorMessage),
        error: true,
      };
    }

    return {
      message: String(err.message ?? defaultErrorMessage),
      error: true,
    };
  }
}
