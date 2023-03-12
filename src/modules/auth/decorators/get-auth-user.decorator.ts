import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetAuthUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
