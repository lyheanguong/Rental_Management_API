import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PropertyImagesController } from './property_images.controller';
import { PropertyImagesService } from './property_images.service';
import { PropertyImage } from './entities/property-image.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      PropertyImage
    ])
  ],

  controllers: [
    PropertyImagesController
  ],

  providers: [
    PropertyImagesService
  ],

  exports: [
    PropertyImagesService
  ]
})
export class PropertyImagesModule { }