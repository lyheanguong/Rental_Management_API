import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';

import {
    FileInterceptor,
} from '@nestjs/platform-express';

import {
    PropertiesService,
} from './properties.service';

import {
    CreatePropertyDto,
} from './dto/create-property.dto';

import {
    UpdatePropertyDto,
} from './dto/update-property.dto';

import {
    propertyImageUpload,
} from '../config/upload.config';

@Controller('properties')
export class PropertiesController {
    constructor(
        private readonly propertiesService:
            PropertiesService,
    ) { }

    // ==========================================
    // GET ALL
    // ==========================================

    @Get()
    findAll() {
        return this.propertiesService.findAll();
    }

    // ==========================================
    // GET BY ID
    // ==========================================

    @Get(':id')
    findOne(
        @Param('id', ParseIntPipe)
        id: number,
    ) {
        return this.propertiesService.findOne(id);
    }

    // ==========================================
    // CREATE PROPERTY + IMAGE
    // ==========================================

    @Post()
    @UseInterceptors(
        FileInterceptor(
            'image',
            propertyImageUpload,
        ),
    )
    create(
        @Body() dto: CreatePropertyDto,

        @UploadedFile()
        file?: Express.Multer.File,
    ) {
        console.log(
            '========== CONTROLLER ==========',
        );

        console.log('FILE:', file);
        console.log('BODY:', dto);

        console.log(
            '================================',
        );

        if (!file) {
            throw new BadRequestException(
                'Image file is required. Use multipart/form-data and field name "image".',
            );
        }

        console.log(
            'Generated filename:',
            file.filename,
        );

        // ==========================================
        // CREATE OBJECT FOR DATABASE
        // ==========================================

        const propertyData = {
            ...dto,

            image: file.filename,
        };

        console.log(
            'Final property data:',
            propertyData,
        );

        // ==========================================
        // SAVE
        // ==========================================

        return this.propertiesService.create(
            propertyData,
        );
    }

    // ==========================================
    // UPDATE
    // ==========================================

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe)
        id: number,

        @Body()
        dto: UpdatePropertyDto,
    ) {
        return this.propertiesService.update(
            id,
            dto,
        );
    }

    // ==========================================
    // DELETE
    // ==========================================

    @Delete(':id')
    remove(
        @Param('id', ParseIntPipe)
        id: number,
    ) {
        return this.propertiesService.remove(
            id,
        );
    }
}