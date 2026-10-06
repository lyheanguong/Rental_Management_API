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
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';

import {
    ApiBearerAuth,
    ApiConsumes,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';

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

import {
    JwtAuthGuard,
} from '../auth/guards/jwt-auth.guard';


@ApiTags('Properties')
@Controller('properties')
export class PropertiesController {
    constructor(
        private readonly propertiesService:
            PropertiesService,
    ) { }


    // ==========================================
    // GET ALL
    // PUBLIC
    // ==========================================

    @Get()
    @ApiOperation({
        summary: 'Get all properties',
    })
    @ApiResponse({
        status: 200,
        description: 'Properties retrieved successfully',
    })
    findAll() {
        return this.propertiesService.findAll();
    }


    // ==========================================
    // GET BY ID
    // PUBLIC
    // ==========================================

    @Get(':id')
    @ApiOperation({
        summary: 'Get property by ID',
    })
    @ApiResponse({
        status: 200,
        description: 'Property retrieved successfully',
    })
    @ApiResponse({
        status: 404,
        description: 'Property not found',
    })
    findOne(
        @Param(
            'id',
            ParseIntPipe,
        )
        id: number,
    ) {
        return this.propertiesService.findOne(id);
    }


    // ==========================================
    // CREATE PROPERTY + IMAGE
    // PROTECTED
    // ==========================================

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({
        summary: 'Create property with image',
    })
    @ApiConsumes('multipart/form-data')
    @ApiResponse({
        status: 201,
        description: 'Property created successfully',
    })
    @ApiResponse({
        status: 400,
        description: 'Image file is required or invalid data',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    @UseInterceptors(
        FileInterceptor(
            'image',
            propertyImageUpload,
        ),
    )
    create(
        @Body()
        dto: CreatePropertyDto,

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

        const propertyData = {
            ...dto,
            image: file.filename,
        };

        console.log(
            'Final property data:',
            propertyData,
        );

        return this.propertiesService.create(
            propertyData,
        );
    }


    // ==========================================
    // GET BY TENANT ID
    // PROTECTED
    // ==========================================

    @Get('tenant/:tenantId')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({
        summary: 'Get properties by tenant ID',
    })
    @ApiResponse({
        status: 200,
        description: 'Tenant properties retrieved successfully',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    findByTenantId(
        @Param(
            'tenantId',
            ParseIntPipe,
        )
        tenantId: number,
    ) {
        return this.propertiesService.findByTenantId(
            tenantId,
        );
    }


    // ==========================================
    // GET BY OWNER ID
    // PROTECTED
    // ==========================================

    @Get('owner/:ownerId')
    @ApiOperation({
        summary: 'Get properties by owner ID',
    })
    @ApiResponse({
        status: 200,
        description: 'Owner properties retrieved successfully',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    findByOwnerId(
        @Param(
            'ownerId',
            ParseIntPipe,
        )
        ownerId: number,
    ) {
        return this.propertiesService.findByOwnerId(
            ownerId,
        );
    }


    // ==========================================
    // UPDATE
    // PROTECTED
    // ==========================================

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({
        summary: 'Update property',
    })
    @ApiResponse({
        status: 200,
        description: 'Property updated successfully',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    @ApiResponse({
        status: 404,
        description: 'Property not found',
    })
    update(
        @Param(
            'id',
            ParseIntPipe,
        )
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
    // PROTECTED
    // ==========================================

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({
        summary: 'Delete property',
    })
    @ApiResponse({
        status: 200,
        description: 'Property deleted successfully',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    @ApiResponse({
        status: 404,
        description: 'Property not found',
    })
    remove(
        @Param(
            'id',
            ParseIntPipe,
        )
        id: number,
    ) {
        return this.propertiesService.remove(
            id,
        );
    }
}