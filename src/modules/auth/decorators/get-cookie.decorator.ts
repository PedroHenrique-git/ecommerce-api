import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request } from 'express';

export const Cookie = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest() as Request;
    const cookie = request.cookies?.[data];

    if (!cookie) {
      throw new InternalServerErrorException('session not found');
    }

    return request.cookies ? cookie : request.cookies;
  },
);
