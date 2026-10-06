import {
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import {
  InjectRepository,
} from '@nestjs/typeorm';

import {
  Repository,
} from 'typeorm';

import {
  Payment,
} from './entities/payment.entity';

import {
  CreatePaymentDto,
} from './dto/create-payment.dto';

import {
  UpdatePaymentDto,
} from './dto/update-payment.dto';

import {
  User,
} from '../users/entities/user.entity';

import {
  TelegramService,
} from '../telegram/telegram.service';


@Injectable()
export class PaymentsService {

  private readonly logger =
    new Logger(
      PaymentsService.name,
    );


  constructor(

    @InjectRepository(Payment)
    private readonly paymentRepository:
      Repository<Payment>,

    @InjectRepository(User)
    private readonly userRepository:
      Repository<User>,

    private readonly telegramService:
      TelegramService,

  ) { }


  // ============================================
  // FIND PAYMENT BY ID
  // ============================================

  private async findPaymentOrFail(
    id: number,
  ): Promise<Payment> {

    const payment =
      await this.paymentRepository.findOne({
        where: {
          id,
        },
      });


    if (!payment) {

      throw new NotFoundException(
        'Payment not found',
      );
    }


    return payment;
  }


  // ============================================
  // GENERATE INVOICE NUMBER
  //
  // FORMAT:
  //
  // INV + MM + YY + 6 DIGIT SEQUENCE
  //
  // August 2026:
  //
  // INV0826000001
  // INV0826000002
  // INV0826000003
  //
  // September 2026:
  //
  // INV0926000001
  //
  // ============================================

  private async generateInvoiceNumber(): Promise<string> {

    const now =
      new Date();


    // ==========================================
    // MONTH
    // ==========================================

    const month =
      String(
        now.getMonth() + 1,
      ).padStart(
        2,
        '0',
      );


    // ==========================================
    // YEAR
    // ==========================================

    const year =
      String(
        now.getFullYear(),
      ).slice(-2);


    // ==========================================
    // PREFIX
    // ==========================================

    const prefix =
      `INV${month}${year}`;


    // ==========================================
    // FIND LAST INVOICE
    // ==========================================

    const lastPayment =
      await this.paymentRepository
        .createQueryBuilder('payment')

        .where(
          'payment.invoice_number LIKE :prefix',
          {
            prefix: `${prefix}%`,
          },
        )

        .orderBy(
          'payment.invoice_number',
          'DESC',
        )

        .getOne();


    // ==========================================
    // START SEQUENCE
    // ==========================================

    let sequence =
      1;


    // ==========================================
    // GET LAST SEQUENCE
    // ==========================================

    if (
      lastPayment &&
      lastPayment.invoice_number
    ) {

      const lastInvoice =
        lastPayment.invoice_number;


      // Last 6 characters
      //
      // INV0826000001
      //         ^^^^^^
      //
      const lastSequence =
        parseInt(
          lastInvoice.slice(-6),
          10,
        );


      if (
        Number.isInteger(
          lastSequence,
        )
      ) {

        sequence =
          lastSequence + 1;
      }
    }


    // ==========================================
    // 6 DIGIT SEQUENCE
    // ==========================================

    const sequenceNumber =
      String(sequence)
        .padStart(
          6,
          '0',
        );


    // ==========================================
    // FINAL INVOICE
    // ==========================================

    const invoiceNumber =
      `${prefix}${sequenceNumber}`;


    this.logger.log(
      `Generated invoice number: ${invoiceNumber}`,
    );


    return invoiceNumber;
  }


  // ============================================
  // GET ALL PAYMENTS
  // ============================================

  async findAll() {

    const payments =
      await this.paymentRepository.find({

        order: {
          created_at: 'DESC',
        },

      });


    return {

      success: true,

      message:
        'Payments retrieved successfully.',

      data: payments,

    };
  }


  // ============================================
  // GET PAYMENT BY ID
  // ============================================

  async findOne(
    id: number,
  ) {

    const payment =
      await this.findPaymentOrFail(
        id,
      );


    return {

      success: true,

      message:
        'Payment retrieved successfully.',

      data: payment,

    };
  }


  // ============================================
  // CREATE PAYMENT
  // ============================================

  async create(
    dto: CreatePaymentDto,
  ) {

    this.logger.log(
      '========================================',
    );

    this.logger.log(
      'CREATING PAYMENT',
    );


    // ==========================================
    // GENERATE INVOICE NUMBER
    // ==========================================

    const invoiceNumber =
      await this.generateInvoiceNumber();


    this.logger.log(
      `Invoice Number: ${invoiceNumber}`,
    );


    // ==========================================
    // CREATE PAYMENT
    // ==========================================

    const payment =
      this.paymentRepository.create({

        ...dto,

        // Always generate automatically.
        // Do NOT allow frontend to overwrite it.

        invoice_number:
          invoiceNumber,

      });


    // ==========================================
    // SAVE PAYMENT
    // ==========================================

    const saved =
      await this.paymentRepository.save(
        payment,
      );


    this.logger.log(
      'PAYMENT CREATED SUCCESSFULLY',
    );


    this.logger.log(
      `Payment ID: ${saved.id}`,
    );

    this.logger.log(
      `Invoice: ${saved.invoice_number}`,
    );


    // ==========================================
    // GET TENANT
    // ==========================================

    let tenant:
      User | null = null;


    if (
      saved.tenant_id
    ) {

      tenant =
        await this.userRepository.findOne({

          where: {
            id: saved.tenant_id,
          },

        });
    }


    // ==========================================
    // TELEGRAM
    // ==========================================

    if (
      tenant &&
      tenant.telegram_id
    ) {

      this.logger.log(
        `Tenant Telegram ID: ${tenant.telegram_id}`,
      );


      // ========================================
      // SEND INVOICE NOTIFICATION
      // ========================================

      const telegramSent =
        await this.telegramService
          .sendPaymentCreatedNotification(

            String(
              tenant.telegram_id,
            ),

            {

              payment_id:
                saved.id,

              invoice_number:
                saved.invoice_number,

              amount:
                Number(
                  saved.amount || 0,
                ),

              payment_month:
                saved.payment_month,

              status:
                saved.status,

              due_date:
                saved.due_date,

              contract_id:
                saved.contract_id,

              tenant_id:
                saved.tenant_id,

              property_id:
                saved.property_id,

              owner_id:
                saved.owner_id,

              rent_amount:
                Number(
                  saved.rent_amount || 0,
                ),

              electric_amount:
                Number(
                  saved.electric_amount || 0,
                ),

              water_amount:
                Number(
                  saved.water_amount || 0,
                ),

              management_fee:
                Number(
                  saved.management_fee || 0,
                ),

              parking_fee:
                Number(
                  saved.parking_fee || 0,
                ),

              other_charges:
                Number(
                  saved.other_charges || 0,
                ),

              discount:
                Number(
                  saved.discount || 0,
                ),

              subtotal:
                Number(
                  saved.subtotal || 0,
                ),

              total_amount:
                Number(
                  saved.total_amount || 0,
                ),

              notes:
                saved.notes,

            },

          );


      // ========================================
      // TELEGRAM RESULT
      // ========================================

      if (telegramSent) {

        this.logger.log(
          `Telegram notification sent successfully for ${saved.invoice_number}`,
        );

      } else {

        this.logger.warn(
          `Telegram notification failed for ${saved.invoice_number}`,
        );
      }

    } else {

      // ========================================
      // NO TELEGRAM
      // ========================================

      this.logger.warn(
        `Tenant ${saved.tenant_id} does not have a Telegram ID.`,
      );

      this.logger.warn(
        `Invoice ${saved.invoice_number} was created without Telegram notification.`,
      );
    }


    this.logger.log(
      '========================================',
    );


    // ==========================================
    // RESPONSE
    // ==========================================

    return {

      success: true,

      message:
        'Payment created successfully.',

      data: saved,

    };
  }


  // ============================================
  // UPDATE PAYMENT
  // ============================================

  async update(
    id: number,
    dto: UpdatePaymentDto,
  ) {

    const payment =
      await this.findPaymentOrFail(
        id,
      );


    Object.assign(
      payment,
      dto,
    );


    const updated =
      await this.paymentRepository.save(
        payment,
      );


    return {

      success: true,

      message:
        'Payment updated successfully.',

      data: updated,

    };
  }


  // ============================================
  // DELETE PAYMENT
  // ============================================

  async remove(
    id: number,
  ) {

    const payment =
      await this.findPaymentOrFail(
        id,
      );


    await this.paymentRepository.remove(
      payment,
    );


    return {

      success: true,

      message:
        'Payment deleted successfully.',

    };
  }


  // ============================================
  // GET PAYMENTS BY CONTRACT
  // ============================================

  async findByContractId(
    contractId: number,
  ) {

    const payments =
      await this.paymentRepository.find({

        where: {
          contract_id:
            contractId,
        },

        order: {
          created_at: 'DESC',
        },

      });


    return {

      success: true,

      message:
        'Payments retrieved successfully.',

      data: payments,

    };
  }


  // ============================================
  // GET PAYMENTS BY OWNER
  // ============================================

  async findByOwnerIdFull(
    ownerId: number,
  ) {

    const payments =
      await this.paymentRepository
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

          'payment.id AS payment_id',

          'payment.invoice_number AS invoice_number',

          'payment.contract_id AS payment_contract_id',

          'payment.amount AS payment_amount',

          'payment.payment_month AS payment_month',

          'payment.payment_method AS payment_method',

          'payment.transaction_reference AS transaction_reference',

          'payment.status AS payment_status',

          'payment.created_at AS payment_created_at',

          'payment.issue_date AS payment_issue_date',

          'payment.due_date AS payment_due_date',

          'payment.rent_amount AS rent_amount',

          'payment.electric_amount AS electric_amount',

          'payment.water_amount AS water_amount',

          'payment.management_fee AS management_fee',

          'payment.parking_fee AS parking_fee',

          'payment.other_charges AS other_charges',

          'payment.discount AS discount',

          'payment.subtotal AS subtotal',

          'payment.total_amount AS total_amount',

          'payment.notes AS payment_notes',


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


          'tenant.id AS tenant_id',

          'tenant.full_name AS tenant_full_name',

          'tenant.email AS tenant_email',

          'tenant.phone AS tenant_phone',

          'tenant.avatar AS tenant_avatar',


          'owner.id AS owner_id',

          'owner.full_name AS owner_full_name',

          'owner.email AS owner_email',

          'owner.phone AS owner_phone',

          'owner.avatar AS owner_avatar',

        ])

        .where(
          'contract.owner_id = :ownerId',
          {
            ownerId,
          },
        )

        .orderBy(
          'payment.created_at',
          'DESC',
        )

        .getRawMany();


    return {

      success: true,

      message:
        'Owner payments retrieved successfully.',

      data: payments,

    };
  }


  // ============================================
  // GET PAYMENTS BY TENANT
  // ============================================

  async findByTenantIdFull(
    tenantId: number,
  ) {

    const payments =
      await this.paymentRepository
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

          'payment.id AS payment_id',

          'payment.invoice_number AS invoice_number',

          'payment.contract_id AS payment_contract_id',

          'payment.amount AS payment_amount',

          'payment.payment_month AS payment_month',

          'payment.payment_method AS payment_method',

          'payment.transaction_reference AS transaction_reference',

          'payment.status AS payment_status',

          'payment.created_at AS payment_created_at',

          'payment.issue_date AS payment_issue_date',

          'payment.due_date AS payment_due_date',

          'payment.rent_amount AS rent_amount',

          'payment.electric_amount AS electric_amount',

          'payment.water_amount AS water_amount',

          'payment.management_fee AS management_fee',

          'payment.parking_fee AS parking_fee',

          'payment.other_charges AS other_charges',

          'payment.discount AS discount',

          'payment.subtotal AS subtotal',

          'payment.total_amount AS total_amount',

          'payment.notes AS payment_notes',


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


          'tenant.id AS tenant_id',

          'tenant.full_name AS tenant_full_name',

          'tenant.email AS tenant_email',

          'tenant.phone AS tenant_phone',

          'tenant.avatar AS tenant_avatar',


          'owner.id AS owner_id',

          'owner.full_name AS owner_full_name',

          'owner.email AS owner_email',

          'owner.phone AS owner_phone',

          'owner.avatar AS owner_avatar',

        ])

        .where(
          'contract.tenant_id = :tenantId',
          {
            tenantId,
          },
        )

        .orderBy(
          'payment.created_at',
          'DESC',
        )

        .getRawMany();


    return {

      success: true,

      message:
        'Tenant payments retrieved successfully.',

      data: payments,

    };
  }


  // ============================================
  // GET ALL FULL
  // ============================================

  async findAllFull() {

    const payments =
      await this.paymentRepository
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

          'payment.id AS payment_id',

          'payment.invoice_number AS invoice_number',

          'payment.contract_id AS payment_contract_id',

          'payment.amount AS payment_amount',

          'payment.payment_month AS payment_month',

          'payment.payment_method AS payment_method',

          'payment.transaction_reference AS transaction_reference',

          'payment.status AS payment_status',

          'payment.created_at AS payment_created_at',

          'payment.issue_date AS payment_issue_date',

          'payment.due_date AS payment_due_date',

          'payment.rent_amount AS rent_amount',

          'payment.electric_amount AS electric_amount',

          'payment.water_amount AS water_amount',

          'payment.management_fee AS management_fee',

          'payment.parking_fee AS parking_fee',

          'payment.other_charges AS other_charges',

          'payment.discount AS discount',

          'payment.subtotal AS subtotal',

          'payment.total_amount AS total_amount',

          'payment.notes AS payment_notes',


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


          'tenant.id AS tenant_id',

          'tenant.full_name AS tenant_full_name',

          'tenant.email AS tenant_email',

          'tenant.phone AS tenant_phone',

          'tenant.avatar AS tenant_avatar',


          'owner.id AS owner_id',

          'owner.full_name AS owner_full_name',

          'owner.email AS owner_email',

          'owner.phone AS owner_phone',

          'owner.avatar AS owner_avatar',

        ])

        .orderBy(
          'payment.created_at',
          'DESC',
        )

        .getRawMany();


    return {

      success: true,

      message:
        'Payments with full information retrieved successfully.',

      data: payments,

    };
  }


  // ============================================
  // GET PAYMENT BY ID FULL
  // ============================================

  async findOneFull(
    id: number,
  ) {

    const payment =
      await this.paymentRepository
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

          'payment.id AS payment_id',

          'payment.invoice_number AS invoice_number',

          'payment.contract_id AS payment_contract_id',

          'payment.amount AS payment_amount',

          'payment.payment_month AS payment_month',

          'payment.payment_method AS payment_method',

          'payment.transaction_reference AS transaction_reference',

          'payment.status AS payment_status',

          'payment.created_at AS payment_created_at',

          'payment.issue_date AS payment_issue_date',

          'payment.due_date AS payment_due_date',

          'payment.rent_amount AS rent_amount',

          'payment.electric_amount AS electric_amount',

          'payment.water_amount AS water_amount',

          'payment.management_fee AS management_fee',

          'payment.parking_fee AS parking_fee',

          'payment.other_charges AS other_charges',

          'payment.discount AS discount',

          'payment.subtotal AS subtotal',

          'payment.total_amount AS total_amount',

          'payment.notes AS payment_notes',


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


          'property.id AS property_id',

          'property.title AS property_title',


          'tenant.id AS tenant_id',

          'tenant.full_name AS tenant_full_name',


          'owner.id AS owner_id',

          'owner.full_name AS owner_full_name',

        ])

        .where(
          'payment.id = :id',
          {
            id,
          },
        )

        .getRawOne();


    if (!payment) {

      throw new NotFoundException(
        'Payment not found',
      );
    }


    return {

      success: true,

      message:
        'Payment with full information retrieved successfully.',

      data: payment,

    };
  }


  // ============================================
  // GET CONTRACT PAYMENTS FULL
  // ============================================

  async findByContractIdFull(
    contractId: number,
  ) {

    const payments =
      await this.paymentRepository
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

          'payment.id AS payment_id',

          'payment.invoice_number AS invoice_number',

          'payment.contract_id AS payment_contract_id',

          'payment.amount AS payment_amount',

          'payment.payment_month AS payment_month',

          'payment.payment_method AS payment_method',

          'payment.transaction_reference AS transaction_reference',

          'payment.status AS payment_status',

          'payment.created_at AS payment_created_at',

          'payment.issue_date AS payment_issue_date',

          'payment.due_date AS payment_due_date',

          'payment.rent_amount AS rent_amount',

          'payment.electric_amount AS electric_amount',

          'payment.water_amount AS water_amount',

          'payment.management_fee AS management_fee',

          'payment.parking_fee AS parking_fee',

          'payment.other_charges AS other_charges',

          'payment.discount AS discount',

          'payment.subtotal AS subtotal',

          'payment.total_amount AS total_amount',

          'payment.notes AS payment_notes',


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


          'property.id AS property_id',

          'property.title AS property_title',


          'tenant.id AS tenant_id',

          'tenant.full_name AS tenant_full_name',


          'owner.id AS owner_id',

          'owner.full_name AS owner_full_name',

        ])

        .where(
          'payment.contract_id = :contractId',
          {
            contractId,
          },
        )

        .orderBy(
          'payment.created_at',
          'DESC',
        )

        .getRawMany();


    return {

      success: true,

      message:
        'Payments with full information retrieved successfully.',

      data: payments,

    };
  }
}