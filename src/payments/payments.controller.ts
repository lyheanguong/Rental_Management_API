
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

import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Controller('payments')
export class PaymentsController {
    constructor(
        private readonly paymentService: PaymentsService,
    ) { }

    // ============================================
    // GET ALL PAYMENTS
    // ============================================
    @Get()
    findAll() {
        return this.paymentService.findAll();
    }

    // ============================================
    // GET ALL PAYMENTS WITH FULL INFORMATION
    // ============================================
    @Get('full')
    findAllFull() {
        return this.paymentService.findAllFull();
    }

    // ============================================
    // GET PAYMENTS BY CONTRACT ID
    // ============================================
    @Get('contract/:contractId')
    findByContractId(
        @Param('contractId', ParseIntPipe)
        contractId: number,
    ) {
        return this.paymentService.findByContractId(
            contractId,
        );
    }

    // ============================================
    // GET PAYMENTS BY CONTRACT ID WITH FULL INFORMATION
    // ============================================
    @Get('contract/:contractId/full')
    findByContractIdFull(
        @Param('contractId', ParseIntPipe)
        contractId: number,
    ) {
        return this.paymentService.findByContractIdFull(
            contractId,
        );
    }

    // ============================================
    // GET PAYMENT BY ID WITH FULL INFORMATION
    // ============================================
    @Get(':id/full')
    findOneFull(
        @Param('id', ParseIntPipe)
        id: number,
    ) {
        return this.paymentService.findOneFull(id);
    }

    // ============================================
    // GET PAYMENT BY ID
    // ============================================
    @Get(':id')
    findOne(
        @Param('id', ParseIntPipe)
        id: number,
    ) {
        return this.paymentService.findOne(id);
    }

    // ============================================
    // CREATE PAYMENT
    // ============================================
    @Post()
    create(
        @Body()
        dto: CreatePaymentDto,
    ) {
        return this.paymentService.create(dto);
    }

    // ============================================
    // UPDATE PAYMENT
    // ============================================
    @Patch(':id')
    update(
        @Param('id', ParseIntPipe)
        id: number,
        @Body()
        dto: UpdatePaymentDto,
    ) {
        return this.paymentService.update(
            id,
            dto,
        );
    }

    // ============================================
    // DELETE PAYMENT
    // ============================================
    @Delete(':id')
    remove(
        @Param('id', ParseIntPipe)
        id: number,
    ) {
        return this.paymentService.remove(id);
    }
}

