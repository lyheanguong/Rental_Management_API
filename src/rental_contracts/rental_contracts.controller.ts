
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
} from '@nestjs/common';

import { CreateRentalContractDto } from './dto/create-rental-contract.dto';
import { UpdateRentalContractDto } from './dto/update-rental-contract.dto';
import { RentalContractsService } from './rental_contracts.service';

@Controller('rental-contracts')
export class RentalContractsController {
    constructor(
        private readonly rentalContractsService: RentalContractsService,
    ) { }

    // ============================================
    // GET ALL CONTRACTS
    // ============================================

    @Get()
    findAll() {
        return this.rentalContractsService.findAll();
    }

    // ============================================
    // GET CONTRACTS BY TENANT ID
    // ============================================

    @Get('tenant/:tenantId')
    findByTenantId(
        @Param('tenantId', ParseIntPipe)
        tenantId: number,
    ) {
        return this.rentalContractsService.findByTenantId(
            tenantId,
        );
    }

    // ============================================
    // GET CONTRACTS BY OWNER ID
    // ============================================

    @Get('owner/:ownerId')
    findByOwnerId(
        @Param('ownerId', ParseIntPipe)
        ownerId: number,
    ) {
        return this.rentalContractsService.findByOwnerId(
            ownerId,
        );
    }

    // ============================================
    // GET CONTRACTS BY PROPERTY ID
    // ============================================

    @Get('property/:propertyId')
    findByPropertyId(
        @Param('propertyId', ParseIntPipe)
        propertyId: number,
    ) {
        return this.rentalContractsService.findByPropertyId(
            propertyId,
        );
    }

    // ============================================
    // GET CONTRACT BY ID
    // ============================================

    @Get(':id')
    findOne(
        @Param('id', ParseIntPipe)
        id: number,
    ) {
        return this.rentalContractsService.findOne(id);
    }

    // ============================================
    // CREATE CONTRACT
    // ============================================

    @Post()
    create(
        @Body()
        dto: CreateRentalContractDto,
    ) {
        return this.rentalContractsService.create(dto);
    }

    // ============================================
    // UPDATE CONTRACT
    // ============================================

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe)
        id: number,
        @Body()
        dto: UpdateRentalContractDto,
    ) {
        return this.rentalContractsService.update(
            id,
            dto,
        );
    }

    // ============================================
    // DELETE CONTRACT
    // ============================================

    @Delete(':id')
    remove(
        @Param('id', ParseIntPipe)
        id: number,
    ) {
        return this.rentalContractsService.remove(id);
    }
}
