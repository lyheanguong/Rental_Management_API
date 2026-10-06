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

import { CreateRentalContractDto } from './dto/create-rental-contract.dto';
import { UpdateRentalContractDto } from './dto/update-rental-contract.dto';
import { RentalContractsService } from './rental_contracts.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Rental Contracts')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('rental-contracts')
export class RentalContractsController {
    constructor(
        private readonly rentalContractsService:
            RentalContractsService,
    ) { }

    // ==========================================
    // GET ALL CONTRACTS
    // ==========================================

    @Get()
    @ApiOperation({
        summary: 'Get all rental contracts',
    })
    @ApiResponse({
        status: 200,
        description: 'Rental contracts retrieved successfully',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    findAll() {
        return this.rentalContractsService.findAll();
    }

    // ==========================================
    // GET CONTRACTS BY TENANT ID
    // ==========================================

    @Get('tenant/:tenantId')
    @ApiOperation({
        summary: 'Get rental contracts by tenant ID',
    })
    @ApiResponse({
        status: 200,
        description: 'Tenant rental contracts retrieved successfully',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    @ApiResponse({
        status: 404,
        description: 'Tenant contracts not found',
    })
    findByTenantId(
        @Param(
            'tenantId',
            ParseIntPipe,
        )
        tenantId: number,
    ) {
        return this.rentalContractsService.findByTenantId(
            tenantId,
        );
    }

    // ==========================================
    // GET CONTRACTS BY OWNER ID
    // ==========================================

    @Get('owner/:ownerId')
    @ApiOperation({
        summary: 'Get rental contracts by owner ID',
    })
    @ApiResponse({
        status: 200,
        description: 'Owner rental contracts retrieved successfully',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    @ApiResponse({
        status: 404,
        description: 'Owner contracts not found',
    })
    findByOwnerId(
        @Param(
            'ownerId',
            ParseIntPipe,
        )
        ownerId: number,
    ) {
        return this.rentalContractsService.findByOwnerId(
            ownerId,
        );
    }

    // ==========================================
    // GET CONTRACTS BY PROPERTY ID
    // ==========================================

    @Get('property/:propertyId')
    @ApiOperation({
        summary: 'Get rental contracts by property ID',
    })
    @ApiResponse({
        status: 200,
        description: 'Property rental contracts retrieved successfully',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    @ApiResponse({
        status: 404,
        description: 'Property contracts not found',
    })
    findByPropertyId(
        @Param(
            'propertyId',
            ParseIntPipe,
        )
        propertyId: number,
    ) {
        return this.rentalContractsService.findByPropertyId(
            propertyId,
        );
    }

    // ==========================================
    // CREATE CONTRACT
    // ==========================================

    @Post()
    @ApiOperation({
        summary: 'Create rental contract',
    })
    @ApiResponse({
        status: 201,
        description: 'Rental contract created successfully',
    })
    @ApiResponse({
        status: 400,
        description: 'Invalid rental contract data',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    @ApiResponse({
        status: 404,
        description: 'Related resource not found',
    })
    create(
        @Body()
        dto: CreateRentalContractDto,
    ) {
        return this.rentalContractsService.create(dto);
    }

    // ==========================================
    // GET CONTRACT BY ID
    // ==========================================

    @Get(':id')
    @ApiOperation({
        summary: 'Get rental contract by ID',
    })
    @ApiResponse({
        status: 200,
        description: 'Rental contract retrieved successfully',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    @ApiResponse({
        status: 404,
        description: 'Rental contract not found',
    })
    findOne(
        @Param(
            'id',
            ParseIntPipe,
        )
        id: number,
    ) {
        return this.rentalContractsService.findOne(id);
    }

    // ==========================================
    // UPDATE CONTRACT
    // ==========================================

    @Patch(':id')
    @ApiOperation({
        summary: 'Update rental contract',
    })
    @ApiResponse({
        status: 200,
        description: 'Rental contract updated successfully',
    })
    @ApiResponse({
        status: 400,
        description: 'Invalid rental contract data',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    @ApiResponse({
        status: 404,
        description: 'Rental contract not found',
    })
    update(
        @Param(
            'id',
            ParseIntPipe,
        )
        id: number,
        @Body()
        dto: UpdateRentalContractDto,
    ) {
        return this.rentalContractsService.update(
            id,
            dto,
        );
    }

    // ==========================================
    // DELETE CONTRACT
    // ==========================================

    @Delete(':id')
    @ApiOperation({
        summary: 'Delete rental contract',
    })
    @ApiResponse({
        status: 200,
        description: 'Rental contract deleted successfully',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    @ApiResponse({
        status: 404,
        description: 'Rental contract not found',
    })
    remove(
        @Param(
            'id',
            ParseIntPipe,
        )
        id: number,
    ) {
        return this.rentalContractsService.remove(id);
    }
}