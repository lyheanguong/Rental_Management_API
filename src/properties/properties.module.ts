import { Module } from '@nestjs/common';
import { PropertiesController } from './properties.controller';
import { PropertiesService } from './properties.service';
import { Property } from './entities/property.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist';

@Module({

  imports: [
    TypeOrmModule.forFeature([
      Property
    ])
  ],

  controllers: [PropertiesController],
  providers: [PropertiesService],
  exports: [PropertiesService],
})
export class PropertiesModule {}
