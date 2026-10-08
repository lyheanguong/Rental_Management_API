import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/users.module';
import { PropertiesModule } from './properties/properties.module';
import { PaymentsModule } from './payments/payments.module';
import { PropertyImagesModule } from './property_images/property_images.module';
import { ReviewsModule } from './reviews/reviews.module';
import { RentalRequestsModule } from './rental_requests/rental_requests.module';
import { RentalContractsModule } from './rental_contracts/rental_contracts.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MessagesModule } from './messages/messages.module';
import { TelegramModule } from './telegram/telegram.module';
import { FavoritesModule } from './favorites/favorites.module';
import { FirebaseModule } from './firebase/firebase.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // =====================================================
    // SERVE UPLOADED FILES
    // =====================================================
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),

    // =====================================================
    // POSTGRESQL DATABASE
    // =====================================================
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (config: ConfigService) => ({
        type: 'postgres',

        // Database connection
        host: config.get<string>('DB_HOST'),
        port: Number(config.get<string>('DB_PORT')),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),

        // =================================================
        // SSL
        // =================================================
        // Vercel/hosted PostgreSQL requires an SSL connection.
        // Local PostgreSQL can continue using normal connection.
        // =================================================
        ssl:
          process.env.VERCEL === '1'
            ? {
              rejectUnauthorized: false,
            }
            : false,

        // Automatically load entities from feature modules
        autoLoadEntities: true,

        // IMPORTANT:
        // Keep this false in production.
        // Do not let TypeORM modify your production database schema.
        synchronize: false,

        // Disable SQL logging
        logging: false,
      }),
    }),

    // =====================================================
    // APPLICATION MODULES
    // =====================================================
    UserModule,
    AuthModule,
    PropertiesModule,
    PaymentsModule,
    PropertyImagesModule,
    ReviewsModule,
    RentalRequestsModule,
    RentalContractsModule,
    MessagesModule,
    TelegramModule,
    FavoritesModule,
    FirebaseModule,
  ],
})
export class AppModule { }