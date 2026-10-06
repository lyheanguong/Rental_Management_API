import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RentalRequest } from './entities/rental-request.entity';
import { Property } from '../properties/entities/property.entity';
import { RentalContract } from '../rental_contracts/entities/rental-contract.entity';
import { Payment } from '../payments/entities/payment.entity';
import { User } from '../users/entities/user.entity';
import { TelegramModule } from '../telegram/telegram.module';
import { FirebaseModule } from '../firebase/firebase.module';
import { RentalRequestsController } from './rental_requests.controller';
import { RentalRequestsService } from './rental_requests.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      RentalRequest,
      Property,
      RentalContract,
      Payment,
      User,
    ]),
    TelegramModule,
    FirebaseModule,
  ],
  controllers: [RentalRequestsController],
  providers: [RentalRequestsService],
  exports: [RentalRequestsService],
})
export class RentalRequestsModule { }