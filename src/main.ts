import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { PORT } from './shared/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: { credentials: true, origin: 'http://127.0.0.1:5173' },
  });

  app.use(helmet());
  app.use(cookieParser());

  await app.listen(PORT);
}

bootstrap();
