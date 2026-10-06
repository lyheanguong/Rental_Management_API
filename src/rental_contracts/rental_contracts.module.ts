import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RentalContract } from './entities/rental-contract.entity';
import { Property } from '../properties/entities/property.entity';
import { RentalContractsController } from './rental_contracts.controller';
import { RentalContractsService } from './rental_contracts.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RentalContract,
      Property,
    ]),
  ],
  controllers: [RentalContractsController,],
  providers: [RentalContractsService,],
})
export class RentalContractsModule { }