import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    Delete,
    Patch,
    ParseIntPipe,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';

import { FilesInterceptor } from '@nestjs/platform-express';

import { PropertyImagesService } from './property_images.service';

import { CreatePropertyImageDto } from './dto/create-property-image.dto';
import { UpdatePropertyImageDto } from './dto/update-property-image.dto';

import { propertyImageUpload } from '../config/upload.config';

@Controller('property-images')
export class PropertyImagesController {
    constructor(
        private readonly imageService: PropertyImagesService,
    ) { }

    // ==========================================
    // Upload multiple images
    // ==========================================
    @Post('upload/:propertyId')
    @UseInterceptors(
        FilesInterceptor(
            'images',
            10,
            propertyImageUpload,
        ),
    )
    uploadImages(
        @Param('propertyId', ParseIntPipe) propertyId: number,
        @UploadedFiles() files: Express.Multer.File[],
    ) {
        return this.imageService.createMultiple(
            propertyId,
            files,
        );
    }

    // ==========================================
    // Create one image manually
    // ==========================================
    @Post()
    create(
        @Body() dto: CreatePropertyImageDto,
    ) {
        return this.imageService.create(dto);
    }

    // ==========================================
    // Get all images by property
    // ==========================================
    @Get('property/:id')
    findByProperty(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.imageService.findByProperty(id);
    }

    // ==========================================
    // Update image
    // ==========================================
    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdatePropertyImageDto,
    ) {
        return this.imageService.update(id, dto);
    }

    // ==========================================
    // Delete image
    // ==========================================
    @Delete(':id')
    remove(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.imageService.remove(id);
    }
}