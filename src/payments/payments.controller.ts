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
    PaymentsService,
} from './payments.service';

import {
    CreatePaymentDto,
} from './dto/create-payment.dto';

import {
    UpdatePaymentDto,
} from './dto/update-payment.dto';

import {
    JwtAuthGuard,
} from '../auth/guards/jwt-auth.guard';


@ApiTags('Payments')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {

    constructor(
        private readonly paymentService:
            PaymentsService,
    ) { }


    // ============================================================
    // GET ALL PAYMENTS
    // ============================================================

    @Get()
    @ApiOperation({
        summary: 'Get all payments',
    })
    @ApiResponse({
        status: 200,
        description: 'Payments retrieved successfully',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    findAll() {

        return this.paymentService.findAll();

    }


    // ============================================================
    // GET ALL PAYMENTS WITH FULL INFORMATION
    // ============================================================

    @Get('full')
    @ApiOperation({
        summary: 'Get all payments with full information',
    })
    @ApiResponse({
        status: 200,
        description: 'Full payment information retrieved successfully',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    findAllFull() {

        return this.paymentService.findAllFull();

    }


    // ============================================================
    // GET PAYMENTS BY OWNER ID
    // ============================================================

    @Get('owner/:ownerId')
    @ApiOperation({
        summary: 'Get payments by owner ID',
    })
    @ApiResponse({
        status: 200,
        description: 'Owner payments retrieved successfully',
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

        return this.paymentService.findByOwnerIdFull(
            ownerId,
        );

    }


    // ============================================================
    // GET PAYMENTS BY TENANT ID
    // ============================================================

    @Get('tenant/:tenantId')
    @ApiOperation({
        summary: 'Get payments by tenant ID',
    })
    @ApiResponse({
        status: 200,
        description: 'Tenant payments retrieved successfully',
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

        return this.paymentService.findByTenantIdFull(
            tenantId,
        );

    }


    // ============================================================
    // GET PAYMENTS BY CONTRACT ID
    // ============================================================

    @Get('contract/:contractId')
    @ApiOperation({
        summary: 'Get payments by contract ID',
    })
    @ApiResponse({
        status: 200,
        description: 'Contract payments retrieved successfully',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    findByContractId(

        @Param(
            'contractId',
            ParseIntPipe,
        )
        contractId: number,

    ) {

        return this.paymentService.findByContractId(
            contractId,
        );

    }


    // ============================================================
    // GET PAYMENTS BY CONTRACT ID
    // FULL INFORMATION
    // ============================================================

    @Get('contract/:contractId/full')
    @ApiOperation({
        summary: 'Get contract payments with full information',
    })
    @ApiResponse({
        status: 200,
        description: 'Full contract payment information retrieved successfully',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    findByContractIdFull(

        @Param(
            'contractId',
            ParseIntPipe,
        )
        contractId: number,

    ) {

        return this.paymentService.findByContractIdFull(
            contractId,
        );

    }


    // ============================================================
    // CREATE PAYMENT
    // ============================================================

    @Post()
    @ApiOperation({
        summary: 'Create payment',
    })
    @ApiResponse({
        status: 201,
        description: 'Payment created successfully',
    })
    @ApiResponse({
        status: 400,
        description: 'Invalid payment data',
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
        dto: CreatePaymentDto,

    ) {

        return this.paymentService.create(
            dto,
        );

    }


    // ============================================================
    // GET PAYMENT BY ID WITH FULL INFORMATION
    // ============================================================

    @Get(':id/full')
    @ApiOperation({
        summary: 'Get payment by ID with full information',
    })
    @ApiResponse({
        status: 200,
        description: 'Full payment information retrieved successfully',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    @ApiResponse({
        status: 404,
        description: 'Payment not found',
    })
    findOneFull(

        @Param(
            'id',
            ParseIntPipe,
        )
        id: number,

    ) {

        return this.paymentService.findOneFull(
            id,
        );

    }


    // ============================================================
    // GET PAYMENT BY ID
    // ============================================================

    @Get(':id')
    @ApiOperation({
        summary: 'Get payment by ID',
    })
    @ApiResponse({
        status: 200,
        description: 'Payment retrieved successfully',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    @ApiResponse({
        status: 404,
        description: 'Payment not found',
    })
    findOne(

        @Param(
            'id',
            ParseIntPipe,
        )
        id: number,

    ) {

        return this.paymentService.findOne(
            id,
        );

    }


    // ============================================================
    // UPDATE PAYMENT
    // ============================================================

    @Patch(':id')
    @ApiOperation({
        summary: 'Update payment',
    })
    @ApiResponse({
        status: 200,
        description: 'Payment updated successfully',
    })
    @ApiResponse({
        status: 400,
        description: 'Invalid payment data',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    @ApiResponse({
        status: 404,
        description: 'Payment not found',
    })
    update(

        @Param(
            'id',
            ParseIntPipe,
        )
        id: number,

        @Body()
        dto: UpdatePaymentDto,

    ) {

        return this.paymentService.update(
            id,
            dto,
        );

    }


    // ============================================================
    // DELETE PAYMENT
    // ============================================================

    @Delete(':id')
    @ApiOperation({
        summary: 'Delete payment',
    })
    @ApiResponse({
        status: 200,
        description: 'Payment deleted successfully',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    @ApiResponse({
        status: 404,
        description: 'Payment not found',
    })
    remove(

        @Param(
            'id',
            ParseIntPipe,
        )
        id: number,

    ) {

        return this.paymentService.remove(
            id,
        );

    }

}