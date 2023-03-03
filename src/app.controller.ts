import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  entry() {
    return { root: true };
  }
}
