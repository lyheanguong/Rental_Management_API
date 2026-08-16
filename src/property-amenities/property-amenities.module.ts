import { Module } from '@nestjs/common';
import { PropertyAmenitiesController } from './property-amenities.controller';
import { PropertyAmenitiesService } from './property-amenities.service';

@Module({
  controllers: [PropertyAmenitiesController],
  providers: [PropertyAmenitiesService]
})
export class PropertyAmenitiesModule {}
