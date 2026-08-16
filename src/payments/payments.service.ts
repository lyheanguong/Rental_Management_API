
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) { }

  // ============================================
  // Find payment by ID
  // ============================================
  private async findPaymentOrFail(id: number): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  // ============================================
  // Get all payments
  // ============================================
  async findAll() {
    const payments = await this.paymentRepository.find({
      order: {
        created_at: 'DESC',
      },
    });

    return {
      success: true,
      message: 'Payments retrieved successfully.',
      data: payments,
    };
  }

  // ============================================
  // Get payment by ID
  // ============================================
  async findOne(id: number) {
    const payment = await this.findPaymentOrFail(id);

    return {
      success: true,
      message: 'Payment retrieved successfully.',
      data: payment,
    };
  }

  // ============================================
  // Get payment with full information
  // ============================================
  async findOneFull(id: number) {
    const payment = await this.paymentRepository
      .createQueryBuilder('payment')

      // Rental contract
      .leftJoin(
        'rental_contracts',
        'contract',
        'contract.id = payment.contract_id',
      )

      // Property
      .leftJoin(
        'properties',
        'property',
        'property.id = contract.property_id',
      )

      // Tenant
      .leftJoin(
        'users',
        'tenant',
        'tenant.id = contract.tenant_id',
      )

      // Owner
      .leftJoin(
        'users',
        'owner',
        'owner.id = contract.owner_id',
      )

      .select([
        // =========================
        // PAYMENT
        // =========================
        'payment.invoice_number AS invoice_number',
        'payment.id AS payment_id',
        'payment.contract_id AS payment_contract_id',
        'payment.amount AS payment_amount',
        'payment.payment_month AS payment_month',
        'payment.payment_method AS payment_method',
        'payment.transaction_reference AS transaction_reference',
        'payment.status AS payment_status',
        'payment.created_at AS payment_created_at',

        // =========================
        // CONTRACT
        // =========================
        'contract.id AS contract_id',
        'contract.request_id AS contract_request_id',
        'contract.property_id AS contract_property_id',
        'contract.tenant_id AS contract_tenant_id',
        'contract.owner_id AS contract_owner_id',
        'contract.start_date AS contract_start_date',
        'contract.end_date AS contract_end_date',
        'contract.monthly_price AS contract_monthly_price',
        'contract.deposit_amount AS contract_deposit_amount',
        'contract.status AS contract_status',
        'contract.created_at AS contract_created_at',

        // =========================
        // PROPERTY
        // =========================
        'property.id AS property_id',
        'property.owner_id AS property_owner_id',
        'property.title AS property_title',
        'property.description AS property_description',
        'property.property_type AS property_type',
        'property.address AS property_address',
        'property.city AS property_city',
        'property.province AS property_province',
        'property.country AS property_country',
        'property.latitude AS property_latitude',
        'property.longitude AS property_longitude',
        'property.price AS property_price',
        'property.bedrooms AS property_bedrooms',
        'property.bathrooms AS property_bathrooms',
        'property.area AS property_area',
        'property.availability_status AS property_availability_status',
        'property.created_at AS property_created_at',
        'property.updated_at AS property_updated_at',

        // =========================
        // TENANT
        // =========================
        'tenant.id AS tenant_id',
        'tenant.full_name AS tenant_full_name',
        'tenant.email AS tenant_email',
        'tenant.phone AS tenant_phone',
        'tenant.avatar AS tenant_avatar',
        'tenant.role AS tenant_role',
        'tenant.status AS tenant_status',

        // =========================
        // OWNER
        // =========================
        'owner.id AS owner_id',
        'owner.full_name AS owner_full_name',
        'owner.email AS owner_email',
        'owner.phone AS owner_phone',
        'owner.avatar AS owner_avatar',
        'owner.role AS owner_role',
        'owner.status AS owner_status',
      ])

      .where('payment.id = :id', { id })
      .getRawOne();

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return {
      success: true,
      message: 'Payment with full information retrieved successfully.',
      data: payment,
    };
  }

  // ============================================
  // Get all payments with full information
  // ============================================
  async findAllFull() {
    const payments = await this.paymentRepository
      .createQueryBuilder('payment')

      // Rental contract
      .leftJoin(
        'rental_contracts',
        'contract',
        'contract.id = payment.contract_id',
      )

      // Property
      .leftJoin(
        'properties',
        'property',
        'property.id = contract.property_id',
      )

      // Tenant
      .leftJoin(
        'users',
        'tenant',
        'tenant.id = contract.tenant_id',
      )

      // Owner
      .leftJoin(
        'users',
        'owner',
        'owner.id = contract.owner_id',
      )

      .select([
        // Payment
        'payment.id AS payment_id',
        'payment.invoice_number AS invoice_number',
        'payment.contract_id AS payment_contract_id',
        'payment.amount AS payment_amount',
        'payment.payment_month AS payment_month',
        'payment.payment_method AS payment_method',
        'payment.transaction_reference AS transaction_reference',
        'payment.status AS payment_status',
        'payment.created_at AS payment_created_at',

        // Contract
        'contract.id AS contract_id',
        'contract.request_id AS contract_request_id',
        'contract.property_id AS contract_property_id',
        'contract.tenant_id AS contract_tenant_id',
        'contract.owner_id AS contract_owner_id',
        'contract.start_date AS contract_start_date',
        'contract.end_date AS contract_end_date',
        'contract.monthly_price AS contract_monthly_price',
        'contract.deposit_amount AS contract_deposit_amount',
        'contract.status AS contract_status',
        'contract.created_at AS contract_created_at',

        // Property
        'property.id AS property_id',
        'property.owner_id AS property_owner_id',
        'property.title AS property_title',
        'property.description AS property_description',
        'property.property_type AS property_type',
        'property.address AS property_address',
        'property.city AS property_city',
        'property.province AS property_province',
        'property.country AS property_country',
        'property.latitude AS property_latitude',
        'property.longitude AS property_longitude',
        'property.price AS property_price',
        'property.bedrooms AS property_bedrooms',
        'property.bathrooms AS property_bathrooms',
        'property.area AS property_area',
        'property.availability_status AS property_availability_status',
        'property.created_at AS property_created_at',
        'property.updated_at AS property_updated_at',

        // Tenant
        'tenant.id AS tenant_id',
        'tenant.full_name AS tenant_full_name',
        'tenant.email AS tenant_email',
        'tenant.phone AS tenant_phone',
        'tenant.avatar AS tenant_avatar',
        'tenant.role AS tenant_role',
        'tenant.status AS tenant_status',

        // Owner
        'owner.id AS owner_id',
        'owner.full_name AS owner_full_name',
        'owner.email AS owner_email',
        'owner.phone AS owner_phone',
        'owner.avatar AS owner_avatar',
        'owner.role AS owner_role',
        'owner.status AS owner_status',
      ])

      .orderBy('payment.created_at', 'DESC')
      .getRawMany();

    return {
      success: true,
      message: 'Payments with full information retrieved successfully.',
      data: payments,
    };
  }

  // ============================================
  // Create payment
  // ============================================
  async create(dto: CreatePaymentDto) {
    const payment = this.paymentRepository.create(dto);

    const saved = await this.paymentRepository.save(payment);

    return {
      success: true,
      message: 'Payment created successfully.',
      data: saved,
    };
  }

  // ============================================
  // Update payment
  // ============================================
  async update(
    id: number,
    dto: UpdatePaymentDto,
  ) {
    const payment = await this.findPaymentOrFail(id);

    Object.assign(payment, dto);

    const updated = await this.paymentRepository.save(payment);

    return {
      success: true,
      message: 'Payment updated successfully.',
      data: updated,
    };
  }

  // ============================================
  // Delete payment
  // ============================================
  async remove(id: number) {
    const payment = await this.findPaymentOrFail(id);

    await this.paymentRepository.remove(payment);

    return {
      success: true,
      message: 'Payment deleted successfully.',
    };
  }

  // ============================================
  // Get payments by contract ID
  // ============================================
  async findByContractId(contractId: number) {
    const payments = await this.paymentRepository.find({
      where: {
        contract_id: contractId,
      },
      order: {
        created_at: 'DESC',
      },
    });

    return {
      success: true,
      message: 'Payments retrieved successfully.',
      data: payments,
    };
  }

  // ============================================
  // Get payments by contract ID with full info
  // ============================================
  async findByContractIdFull(contractId: number) {
    const payments = await this.paymentRepository
      .createQueryBuilder('payment')

      .leftJoin(
        'rental_contracts',
        'contract',
        'contract.id = payment.contract_id',
      )

      .leftJoin(
        'properties',
        'property',
        'property.id = contract.property_id',
      )

      .leftJoin(
        'users',
        'tenant',
        'tenant.id = contract.tenant_id',
      )

      .leftJoin(
        'users',
        'owner',
        'owner.id = contract.owner_id',
      )

      .select([
        // Payment
        'payment.id AS payment_id',
        'payment.contract_id AS payment_contract_id',
        'payment.amount AS payment_amount',
        'payment.payment_month AS payment_month',
        'payment.payment_method AS payment_method',
        'payment.transaction_reference AS transaction_reference',
        'payment.status AS payment_status',
        'payment.created_at AS payment_created_at',

        // Contract
        'contract.id AS contract_id',
        'contract.request_id AS contract_request_id',
        'contract.property_id AS contract_property_id',
        'contract.tenant_id AS contract_tenant_id',
        'contract.owner_id AS contract_owner_id',
        'contract.start_date AS contract_start_date',
        'contract.end_date AS contract_end_date',
        'contract.monthly_price AS contract_monthly_price',
        'contract.deposit_amount AS contract_deposit_amount',
        'contract.status AS contract_status',
        'contract.created_at AS contract_created_at',

        // Property
        'property.id AS property_id',
        'property.title AS property_title',
        'property.description AS property_description',
        'property.property_type AS property_type',
        'property.address AS property_address',
        'property.city AS property_city',
        'property.province AS property_province',
        'property.country AS property_country',
        'property.latitude AS property_latitude',
        'property.longitude AS property_longitude',
        'property.price AS property_price',
        'property.bedrooms AS property_bedrooms',
        'property.bathrooms AS property_bathrooms',
        'property.area AS property_area',
        'property.availability_status AS property_availability_status',

        // Tenant
        'tenant.id AS tenant_id',
        'tenant.full_name AS tenant_full_name',
        'tenant.email AS tenant_email',
        'tenant.phone AS tenant_phone',
        'tenant.avatar AS tenant_avatar',

        // Owner
        'owner.id AS owner_id',
        'owner.full_name AS owner_full_name',
        'owner.email AS owner_email',
        'owner.phone AS owner_phone',
        'owner.avatar AS owner_avatar',
      ])

      .where('payment.contract_id = :contractId', {
        contractId,
      })

      .orderBy('payment.created_at', 'DESC')
      .getRawMany();

    return {
      success: true,
      message: 'Payments with full information retrieved successfully.',
      data: payments,
    };
  }
}
