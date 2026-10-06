import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';

import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';

import {
    CreateRentalRequestDto,
} from './dto/create-rental-request.dto';

import {
    UpdateRentalRequestDto,
} from './dto/update-rental-request.dto';

import {
    RentalRequestsService,
} from './rental_requests.service';

import {
    JwtAuthGuard,
} from '../auth/guards/jwt-auth.guard';

@ApiTags('Rental Requests')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('rental-requests')
export class RentalRequestsController {

    constructor(
        private readonly rentalService:
            RentalRequestsService,
    ) { }

    // =========================================
    // GET ALL RENTAL REQUESTS
    // GET /rental-requests
    // =========================================

    @Get()
    @ApiOperation({
        summary: 'Get all rental requests',
    })
    @ApiResponse({
        status: 200,
        description:
            'Rental requests retrieved successfully',
    })
    findAll() {
        return this.rentalService.findAll();
    }

    // =========================================
    // GET RENTAL REQUESTS BY TENANT
    // GET /rental-requests/tenant/:tenantId
    // =========================================

    @Get('tenant/:tenantId')
    @ApiOperation({
        summary: 'Get rental requests by tenant ID',
    })
    @ApiResponse({
        status: 200,
        description:
            'Tenant rental requests retrieved successfully',
    })
    @ApiResponse({
        status: 404,
        description: 'Tenant not found',
    })
    findByTenantId(
        @Param('tenantId', ParseIntPipe)
        tenantId: number,
    ) {
        return this.rentalService.findByTenantId(
            tenantId,
        );
    }

    // =========================================
    // GET RENTAL REQUEST BY ID
    // GET /rental-requests/:id
    // =========================================

    @Get(':id')
    @ApiOperation({
        summary: 'Get rental request by ID',
    })
    @ApiResponse({
        status: 200,
        description:
            'Rental request retrieved successfully',
    })
    @ApiResponse({
        status: 404,
        description: 'Rental request not found',
    })
    findOne(
        @Param('id', ParseIntPipe)
        id: number,
    ) {
        return this.rentalService.findOne(id);
    }

    // =========================================
    // CREATE RENTAL REQUEST
    // POST /rental-requests
    // =========================================

    @Post()
    @ApiOperation({
        summary: 'Create a rental request',
    })
    @ApiResponse({
        status: 201,
        description:
            'Rental request created successfully',
    })
    @ApiResponse({
        status: 400,
        description: 'Invalid rental request data',
    })
    create(
        @Body()
        dto: CreateRentalRequestDto,
    ) {
        return this.rentalService.create(dto);
    }

    // =========================================
    // UPDATE RENTAL REQUEST
    // PATCH /rental-requests/:id
    // =========================================

    @Patch(':id')
    @ApiOperation({
        summary: 'Update a rental request',
    })
    @ApiResponse({
        status: 200,
        description:
            'Rental request updated successfully',
    })
    @ApiResponse({
        status: 404,
        description: 'Rental request not found',
    })
    update(
        @Param('id', ParseIntPipe)
        id: number,

        @Body()
        dto: UpdateRentalRequestDto,
    ) {
        return this.rentalService.update(
            id,
            dto,
        );
    }

    // =========================================
    // DELETE RENTAL REQUEST
    // DELETE /rental-requests/:id
    // =========================================

    @Delete(':id')
    @ApiOperation({
        summary: 'Delete a rental request',
    })
    @ApiResponse({
        status: 200,
        description:
            'Rental request deleted successfully',
    })
    @ApiResponse({
        status: 404,
        description: 'Rental request not found',
    })
    remove(
        @Param('id', ParseIntPipe)
        id: number,
    ) {
        return this.rentalService.remove(id);
    }
}