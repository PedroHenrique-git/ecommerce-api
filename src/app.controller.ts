import { Controller, Get } from '@nestjs/common';
import { Public } from './modules/auth/decorators/public-route.decorator';

@Controller()
export class AppController {
  @Public()
  @Get()
  entry() {
    return { root: true };
  }
}
