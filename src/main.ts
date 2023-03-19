import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { ALLOWED_ORIGINS, GLOBAL_PREFIX, PORT } from './shared/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      credentials: true,
      origin: ALLOWED_ORIGINS,
    },
  });

  app.setGlobalPrefix(GLOBAL_PREFIX, {
    exclude: [''],
  });

  app.use(helmet());
  app.use(cookieParser());

  await app.listen(PORT);
}

bootstrap();
