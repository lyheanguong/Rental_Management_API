import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RentalContract } from './entities/rental-contract.entity';
import { RentalContractsController } from './rental_contracts.controller';
import { RentalContractsService } from './rental_contracts.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RentalContract]),
  ],
  controllers: [RentalContractsController],
  providers: [RentalContractsService],
  exports: [RentalContractsService],
})
export class RentalContractsModule { }