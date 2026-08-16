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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Serve uploaded files
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: Number(config.get<string>('DB_PORT')),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),

        autoLoadEntities: true,
        synchronize: false,
        logging: false,
      }),
    }),

    UserModule,
    AuthModule,
    PropertiesModule,
    PaymentsModule,
    PropertyImagesModule,
    ReviewsModule,
    RentalRequestsModule,
    RentalContractsModule,
  ],
})
export class AppModule { }