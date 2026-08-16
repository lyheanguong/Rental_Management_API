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
import { CreateRentalRequestDto } from './dto/create-rental-request.dto';
import { UpdateRentalRequestDto } from './dto/update-rental-request.dto';
import { RentalRequestsService } from './rental_requests.service';

@Controller('rental-requests')
export class RentalRequestsController {
    constructor(
        private readonly rentalService: RentalRequestsService,
    ) { }

    @Get()
    findAll() {
        return this.rentalService.findAll();
    }

    @Get('tenant/:tenantId')
    findByTenantId(
        @Param('tenantId', ParseIntPipe) tenantId: number,
    ) {
        return this.rentalService.findByTenantId(tenantId);
    }

    @Get(':id')
    findOne(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.rentalService.findOne(id);
    }

    @Post()
    create(
        @Body() dto: CreateRentalRequestDto,
    ) {
        return this.rentalService.create(dto);
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateRentalRequestDto,
    ) {
        return this.rentalService.update(id, dto);
    }

    @Delete(':id')
    remove(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.rentalService.remove(id);
    }
}