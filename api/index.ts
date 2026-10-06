import 'pg';

import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';
import express from 'express';

import { AppModule } from '../src/app.module';

const server = express();

let app: NestExpressApplication | null = null;

async function bootstrap() {
    const nestApp =
        await NestFactory.create<NestExpressApplication>(
            AppModule,
            new ExpressAdapter(server),
        );

    nestApp.setGlobalPrefix('api', {
        exclude: ['api'],
    });

    nestApp.enableCors({
        origin: true,
        credentials: true,
    });

    nestApp.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    nestApp.useStaticAssets(
        join(process.cwd(), 'uploads'),
        {
            prefix: '/uploads/',
        },
    );

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
            nestApp,
            swaggerConfig,
        );

    SwaggerModule.setup(
        'api',
        nestApp,
        swaggerDocument,
    );

    await nestApp.init();

    return nestApp;
}

export default async function handler(
    req: express.Request,
    res: express.Response,
) {
    if (!app) {
        app = await bootstrap();
    }

    return server(req, res);
}