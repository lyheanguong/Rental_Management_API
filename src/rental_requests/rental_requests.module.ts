import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RentalRequest } from './entities/rental-request.entity';
import { RentalRequestsController } from './rental_requests.controller';
import { RentalRequestsService } from './rental_requests.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([RentalRequest]),
  ],
  controllers: [RentalRequestsController],
  providers: [RentalRequestsService],
  exports: [RentalRequestsService],
})
export class RentalRequestsModule { }