import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

import { AppModule } from './app.module';

async function bootstrap() {
  const app =
    await NestFactory.create<NestExpressApplication>(
      AppModule,
    );

  // ==============================
  // CORS
  // ==============================

  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  // ==============================
  // VALIDATION
  // ==============================

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ==============================
  // SERVE UPLOADED FILES
  // ==============================

  app.useStaticAssets(
    join(__dirname, '..', 'uploads'),
    {
      prefix: '/uploads/',
    },
  );

  // ==============================
  // START SERVER
  // ==============================

  await app.listen(3000);

  console.log(
    'Backend running on http://localhost:3000',
  );
}

bootstrap();