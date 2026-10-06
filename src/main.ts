import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import {
  SwaggerModule,
  DocumentBuilder,
} from '@nestjs/swagger';
import { join } from 'path';
import { exec } from 'child_process';

import { AppModule } from './app.module';

async function bootstrap() {
  const app =
    await NestFactory.create<NestExpressApplication>(
      AppModule,
    );

  // ==============================
  // API PREFIX
  // ==============================

  app.setGlobalPrefix('api', {
    exclude: ['api'],
  });

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
  // SWAGGER
  // ==============================

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Rental Management API')
    .setDescription(
      'API documentation for the Rental Management System',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter your JWT access token',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const swaggerDocument =
    SwaggerModule.createDocument(
      app,
      swaggerConfig,
    );

  SwaggerModule.setup(
    'api',
    app,
    swaggerDocument,
  );

  // ==============================
  // START SERVER
  // ==============================

  await app.listen(3000);

  console.log(
    'Backend running on http://localhost:3000',
  );

  console.log(
    'API base URL: http://localhost:3000/api',
  );

  console.log(
    'Swagger running on http://localhost:3000/api',
  );

  // Automatically open Swagger in browser
  if (process.env.OPEN_SWAGGER === 'true') {
    exec('open http://localhost:3000/api');
  }
}

bootstrap();