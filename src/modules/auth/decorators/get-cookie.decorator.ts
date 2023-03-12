import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const Cookie = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest() as Request;
    return request.cookies ? request.cookies?.[data] : request.cookies;
  },
);
