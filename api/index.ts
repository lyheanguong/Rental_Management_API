import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import express from 'express';

const server = express();

let app: any;

async function bootstrap() {
    const nestApp = await NestFactory.create(
        AppModule,
        new ExpressAdapter(server),
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