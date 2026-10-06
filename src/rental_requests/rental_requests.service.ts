import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RentalRequest } from './entities/rental-request.entity';
import { CreateRentalRequestDto } from './dto/create-rental-request.dto';
import { UpdateRentalRequestDto } from './dto/update-rental-request.dto';
import { Property } from '../properties/entities/property.entity';
import { RentalContract } from '../rental_contracts/entities/rental-contract.entity';
import { Payment } from '../payments/entities/payment.entity';
import { User } from '../users/entities/user.entity';
import { TelegramService } from '../telegram/telegram.service';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class RentalRequestsService {

    private readonly logger = new Logger(RentalRequestsService.name);
    constructor(
        // RENTAL REQUEST REPOSITORY
        @InjectRepository(RentalRequest)
        private readonly rentalRepository: Repository<RentalRequest>,
        // PROPERTY REPOSITORY
        @InjectRepository(Property)
        private readonly propertyRepository: Repository<Property>,
        // RENTAL CONTRACT REPOSITORY
        @InjectRepository(RentalContract)
        private readonly contractRepository: Repository<RentalContract>,
        // PAYMENT REPOSITORY
        @InjectRepository(Payment)
        private readonly paymentRepository: Repository<Payment>,
        // USER REPOSITORY
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        // TELEGRAM SERVICE
        private readonly telegramService: TelegramService,
        // FIREBASE SERVICE
        private readonly firebaseService: FirebaseService,
    ) { }

    // PRIVATE FIND RENTAL REQUEST OR FAIL
    private async findRentalOrFail(id: number): Promise<RentalRequest> {
        const rental = await this.rentalRepository.findOne({
            where: { id },
        });
        if (!rental) {
            throw new NotFoundException('Rental request not found');
        }
        return rental;
    }
    // GENERATE INVOICE NUMBER
    private async generateInvoiceNumber(): Promise<string> {
        const now = new Date();
        // MONTH
        const month = String(now.getMonth() + 1).padStart(2, '0');
        // YEAR
        const year = String(now.getFullYear()).slice(-2);
        // PREFIX
        const prefix = `INV${month}${year}`;
        // FIND LAST PAYMENT
        const lastPayment = await this.paymentRepository.createQueryBuilder('payment')
            .where(
                'payment.invoice_number LIKE : prefix',
                {
                    prefix: `${prefix}%`,
                },
            ).orderBy('payment.invoice_number', 'DESC').getOne();
        // DEFAULT SEQUENCE
        let sequence = 1;

        // GET LAST SEQUENCE
        if (lastPayment && lastPayment.invoice_number) {
            const lastInvoice = lastPayment.invoice_number;
            const lastSequence = parseInt(lastInvoice.slice(-6), 10);

            if (Number.isInteger(lastSequence)
            ) {
                sequence = lastSequence + 1;
            }
        }
        // 6 DIGIT SEQUENCE
        const sequenceNumber = String(sequence).padStart(6, '0');
        // FINAL INVOICE
        const invoiceNumber = `${prefix}${sequenceNumber}`;
        this.logger.log(`Generated invoice number: ${invoiceNumber}`);
        return invoiceNumber;
    }

    // GET ALL RENTAL REQUESTS
    async findAll() {
        const rentals = await this.rentalRepository.find({
            order: { created_at: 'DESC' },
        });
        return {
            success: true,
            message: 'Rental requests retrieved successfully.',
            data: rentals,
        };
    }

    // GET RENTAL REQUEST BY ID FULL INFORMATION
    async findOne(id: number) {
        const rental = await this.rentalRepository.createQueryBuilder('request')
            .leftJoin(
                'properties',
                'property',
                'property.id = request.property_id',
            )
            .leftJoin(
                'users',
                'tenant',
                'tenant.id = request.tenant_id',
            )
            .leftJoin(
                'users',
                'owner',
                'owner.id = property.owner_id',
            )
            .select([
                // RENTAL REQUEST
                'request.id AS request_id',
                'request.property_id AS request_property_id',
                'request.tenant_id AS request_tenant_id',
                'request.start_date AS request_start_date',
                'request.end_date AS request_end_date',
                'request.message AS request_message',
                'request.status AS request_status',
                'request.created_at AS request_created_at',
                'request.updated_at AS request_updated_at',
                // PROPERTY
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
                'property.property_code AS property_code',
                'property.image AS property_image',
                'property.created_at AS property_created_at',
                'property.updated_at AS property_updated_at',
                // TENANT
                'tenant.id AS tenant_id',
                'tenant.full_name AS tenant_full_name',
                'tenant.email AS tenant_email',
                'tenant.phone AS tenant_phone',
                'tenant.avatar AS tenant_avatar',
                'tenant.role AS tenant_role',
                'tenant.status AS tenant_status',
                // OWNER
                'owner.id AS owner_id',
                'owner.full_name AS owner_full_name',
                'owner.email AS owner_email',
                'owner.phone AS owner_phone',
                'owner.avatar AS owner_avatar',
                'owner.role AS owner_role',
                'owner.status AS owner_status',
            ])
            .where(
                'request.id = :id',
                { id },
            ).getRawOne();

        if (!rental) {
            throw new NotFoundException('Rental request not found');
        }
        return {
            success: true,
            message: 'Rental request with full information retrieved successfully.',
            data: rental,
        };
    }

    // CREATE RENTAL REQUEST
    async create(dto: CreateRentalRequestDto) {
        // CHECK PROPERTY
        const property = await this.propertyRepository.findOne({ where: { id: dto.property_id } });
        if (!property) {
            throw new NotFoundException(`Property with ID ${dto.property_id} not found`);
        }
        // CREATE REQUEST
        const rental = this.rentalRepository.create(dto);
        const saved = await this.rentalRepository.save(rental);
        return {
            success: true,
            message: 'Rental request created successfully.',
            data: saved,
        };
    }

    // AUTO CREATE CONTRACT + PAYMENT

    private async createContractAndPayment(
        rental: RentalRequest,
        property: Property,
    ) {

        // VALIDATE REQUEST
        if (rental.id === undefined || rental.property_id === undefined || rental.tenant_id === undefined) {
            throw new NotFoundException('Rental request is missing required information.');
        }
        // VALIDATE OWNER
        if (property.owner_id === undefined || property.owner_id === null) {
            throw new NotFoundException(
                `Owner ID is missing from property ${property.id}`,
            );
        }
        // CHECK EXISTING CONTRACT
        const existingContract = await this.contractRepository.findOne({ where: { request_id: rental.id } });
        if (existingContract) {
            this.logger.log(`Contract already exists: ${existingContract.id}`);
            const existingPayment =
                await this.paymentRepository.findOne({
                    where: {
                        contract_id: existingContract.id,
                    },
                });
            return {
                contract: existingContract,
                payment: existingPayment ?? null,
            };
        }
        // CREATE CONTRACT
        const contract = this.contractRepository.create({
            request_id: rental.id,
            property_id: rental.property_id,
            tenant_id: rental.tenant_id,
            owner_id: property.owner_id,
            start_date: new Date(rental.start_date ?? ''),
            end_date: new Date(rental.end_date ?? ''),
            monthly_price: Number(property.price),
            deposit_amount: Number(property.price),
            status: 'ACTIVE',
        });

        const savedContract = await this.contractRepository.save(contract);
        this.logger.log('========================================');
        this.logger.log('CONTRACT CREATED');
        this.logger.log(`Contract ID: ${savedContract.id}`);
        this.logger.log('========================================');
        // PAYMENT AMOUNT
        const rentAmount = Number(property.price);
        // PAYMENT DATES
        const issueDate = new Date();
        const dueDate = new Date(rental.start_date ?? '');
        // GENERATE INVOICE
        const invoiceNumber = await this.generateInvoiceNumber();
        this.logger.log(`Invoice Number: ${invoiceNumber}`);
        // CREATE PAYMENT
        const payment = this.paymentRepository.create({
            contract_id: savedContract.id,
            amount: rentAmount,
            payment_month: new Date(rental.start_date ?? ''),
            payment_method: 'BANK_TRANSFER',
            transaction_reference: null,
            status: 'PENDING',
            invoice_number: invoiceNumber,
            tenant_id: rental.tenant_id,
            property_id: rental.property_id,
            owner_id: property.owner_id,
            issue_date: issueDate,
            due_date: dueDate,
            rent_amount: rentAmount,
            electric_amount: 0,
            water_amount: 0,
            management_fee: 0,
            parking_fee: 0,
            other_charges: 0,
            discount: 0,
            subtotal: rentAmount,
            total_amount: rentAmount,
            notes: `Initial payment for rental contract #${savedContract.id}`,
        });
        // SAVE PAYMENT
        const savedPayment = await this.paymentRepository.save(payment);
        this.logger.log('========================================');
        this.logger.log('PAYMENT CREATED');
        this.logger.log(`Payment ID: ${savedPayment.id}`);
        this.logger.log(`Invoice Number: ${savedPayment.invoice_number}`);
        this.logger.log(`Amount: ${savedPayment.amount}`);
        this.logger.log('========================================');
        // GET TENANT
        const tenant = await this.userRepository.findOne({
            where: {
                id: savedPayment.tenant_id,
            },
        });
        // FCM NOTIFICATION RENTAL REQUEST APPROVED
        if (tenant && tenant.fcm_token) {
            this.logger.log('========================================');
            this.logger.log('SENDING FCM APPROVAL NOTIFICATION');
            this.logger.log(`Tenant: ${tenant.full_name}`);
            this.logger.log(`Tenant ID: ${tenant.id}`);
            this.logger.log(`FCM Token: ${tenant.fcm_token}`);
            this.logger.log('========================================',);
            try {
                const fcmResponse = await this.firebaseService
                    .sendNotification(
                        tenant.fcm_token,
                        'Rental Request Approved',
                        `Your rental request for ${property.title} has been approved.`,
                        {
                            type: 'RENTAL_REQUEST_APPROVED',
                            request_id: String(rental.id),
                            contract_id: String(savedContract.id),
                            payment_id: String(savedPayment.id),
                            property_id: String(property.id),
                        },
                    );
                this.logger.log(`FCM notification sent successfully: ${fcmResponse}`,);
            } catch (error) {
                this.logger.error(
                    'FCM notification error',
                    error instanceof Error ? error.stack : String(error),
                );
            }
        } else {
            this.logger.warn('========================================');
            this.logger.warn('FCM NOT SENT');
            this.logger.warn(`Tenant ID: ${savedPayment.tenant_id}`);
            this.logger.warn('Tenant does not have fcm_token.',);
            this.logger.warn('========================================',);
        }
        // TELEGRAM NOTIFICATION
        if (tenant && tenant.telegram_id) {
            this.logger.log('========================================');
            this.logger.log('SENDING TELEGRAM INVOICE');
            this.logger.log(`Tenant: ${tenant.full_name}`);
            this.logger.log(`Telegram ID: ${tenant.telegram_id}`);
            this.logger.log(`Invoice: ${savedPayment.invoice_number}`);
            this.logger.log('========================================',);
            try {
                const telegramSent = await this.telegramService
                    .sendPaymentCreatedNotification(
                        String(tenant.telegram_id),
                        {
                            payment_id: savedPayment.id,
                            invoice_number: savedPayment.invoice_number,
                            amount: Number(savedPayment.amount || 0,),
                            payment_month: savedPayment.payment_month,
                            status: savedPayment.status,
                            due_date: savedPayment.due_date,
                            contract_id: savedPayment.contract_id,
                            tenant_id: savedPayment.tenant_id,
                            property_id: savedPayment.property_id,
                            owner_id: savedPayment.owner_id,
                            rent_amount: Number(savedPayment.rent_amount || 0,),
                            electric_amount: Number(savedPayment.electric_amount || 0,),
                            water_amount: Number(savedPayment.water_amount || 0,),
                            management_fee: Number(savedPayment.management_fee || 0,),
                            parking_fee: Number(savedPayment.parking_fee || 0),
                            other_charges: Number(savedPayment.other_charges || 0),
                            discount: Number(savedPayment.discount || 0),
                            subtotal: Number(savedPayment.subtotal || 0),
                            total_amount: Number(savedPayment.total_amount || 0),
                            notes: savedPayment.notes,
                            property_title: property.title,
                        },
                    );
                if (telegramSent) {
                    this.logger.log(`Telegram invoice sent successfully: ${savedPayment.invoice_number}`);
                } else {
                    this.logger.warn(`Telegram invoice was NOT sent: ${savedPayment.invoice_number}`);
                }
            } catch (error) {
                this.logger.error(
                    'Telegram notification error',
                    error instanceof Error ? error.stack : String(error),
                );
            }
        } else {
            this.logger.warn('========================================');
            this.logger.warn('TELEGRAM NOT SENT',);
            this.logger.warn(`Tenant ID: ${savedPayment.tenant_id}`);
            this.logger.warn('Tenant does not have telegram_id.');
            this.logger.warn('========================================');
        }
        // RETURN
        return {
            contract: savedContract,
            payment: savedPayment,
        };
    }

    // UPDATE RENTAL REQUEST
    async update(
        id: number,
        dto: UpdateRentalRequestDto,
    ) {

        this.logger.log('========================================');
        this.logger.log('RENTAL REQUEST UPDATE');
        this.logger.log(`Request ID: ${id}`);
        this.logger.log('DTO:', dto);
        this.logger.log('========================================');

        // FIND REQUEST
        const rental = await this.findRentalOrFail(id);
        // OLD VALUES
        const oldStatus = rental.status;
        const oldPropertyId = rental.property_id;
        this.logger.log(`OLD STATUS: ${oldStatus}`);
        this.logger.log(`OLD PROPERTY ID: ${oldPropertyId}`);

        // PROPERTY ID REQUIRED
        if (oldPropertyId === undefined || oldPropertyId === null) {
            throw new NotFoundException(
                `Property ID is missing from rental request ${id}`,
            );
        }

        // CHECK NEW PROPERTY
        if (dto.property_id !== undefined && dto.property_id !== oldPropertyId) {
            const newProperty =
                await this.propertyRepository.findOne({
                    where: {
                        id: dto.property_id,
                    },
                });
            if (!newProperty) {
                throw new NotFoundException(
                    `Property with ID ${dto.property_id} not found`,
                );
            }
        }
        // UPDATE PROPERTY
        if (dto.property_id !== undefined) {
            rental.property_id = dto.property_id;
        }
        // UPDATE TENANT
        if (dto.tenant_id !== undefined) {
            rental.tenant_id = dto.tenant_id;
        }
        // UPDATE START DATE

        if (dto.start_date !== undefined) {
            rental.start_date = dto.start_date
        }
        // UPDATE END DATE
        if (dto.end_date !== undefined) {
            rental.end_date = dto.end_date;
        }
        // UPDATE MESSAGE
        if (dto.message !== undefined) { rental.message = dto.message }
        // UPDATE STATUS
        if (dto.status !== undefined) { rental.status = dto.status; }
        // FINAL PROPERTY ID
        const finalPropertyId = rental.property_id;
        if (finalPropertyId === undefined || finalPropertyId === null) {
            throw new NotFoundException(`Property ID is missing from rental request ${id}`);
        }
        // STATUS CHANGED
        const statusChanged = dto.status !== undefined && String(dto.status,).toUpperCase() !== String(oldStatus).toUpperCase();

        // SAVE REQUEST
        const updated = await this.rentalRepository.save(rental);
        this.logger.log('RENTAL REQUEST SAVED:');
        this.logger.log(JSON.stringify(updated));
        // GET FINAL PROPERTY
        const property = await this.propertyRepository.findOne({ where: { id: finalPropertyId } });
        if (!property) { throw new NotFoundException(`Property with ID ${finalPropertyId} not found`) }
        // APPROVED
        if (
            statusChanged && dto.status !== undefined &&
            String(dto.status).toUpperCase() === 'APPROVED'
        ) {
            this.logger.log('========================================',);
            this.logger.log('REQUEST APPROVED');
            this.logger.log('PROPERTY → RENTED');
            this.logger.log('========================================',);
            // PROPERTY → RENTED
            property.availability_status = 'rented';
            await this.propertyRepository.save(property);
            // CREATE CONTRACT + PAYMENT
            const result = await this.createContractAndPayment(rental, property);
            this.logger.log('AUTO CONTRACT:',);
            this.logger.log(
                JSON.stringify(result.contract),
            );
            this.logger.log('AUTO PAYMENT:');
            this.logger.log(
                JSON.stringify(result.payment),
            );
        }
        // REJECTED
        else if (
            statusChanged &&
            dto.status !== undefined &&
            String(dto.status,).toUpperCase() === 'REJECTED'
        ) {
            this.logger.log('REQUEST REJECTED');
            this.logger.log('PROPERTY → AVAILABLE');
            property.availability_status = 'available';
            await this.propertyRepository.save(property);
        }
        // CANCELLED
        else if (
            statusChanged &&
            dto.status !== undefined &&
            String(dto.status).toUpperCase() === 'CANCELLED'
        ) {
            this.logger.log('REQUEST CANCELLED');
            this.logger.log('PROPERTY → AVAILABLE');
            property.availability_status = 'available';
            await this.propertyRepository.save(property);
        }
        // PROPERTY ID CHANGED
        if (dto.property_id !== undefined && dto.property_id !== oldPropertyId) {
            this.logger.log(`PROPERTY ID CHANGED: ${oldPropertyId} → ${dto.property_id}`);
            // OLD PROPERTY → AVAILABLE
            const oldProperty = await this.propertyRepository.findOne({ where: { id: oldPropertyId } });
            if (oldProperty) {
                oldProperty.availability_status = 'available';
                await this.propertyRepository.save(oldProperty);
                this.logger.log(`OLD PROPERTY SET TO AVAILABLE: ${oldPropertyId}`);
            }
            // NEW PROPERTY → RENTED
            if (rental.status && String(rental.status).toUpperCase() === 'APPROVED') {
                const newProperty =
                    await this.propertyRepository.findOne({
                        where: { id: dto.property_id },
                    });
                if (newProperty) {
                    newProperty.availability_status = 'rented';
                    await this.propertyRepository.save(newProperty);
                    this.logger.log(`NEW PROPERTY SET TO RENTED: ${dto.property_id}`);
                }
            }
        }
        // RESPONSE
        return {
            success: true,
            message: 'Rental request updated successfully.',
            data: updated,
        };
    }

    // DELETE RENTAL REQUEST
    async remove(
        id: number,
    ) {
        const rental =
            await this.findRentalOrFail(
                id,
            );
        await this.rentalRepository.remove(rental);
        return {
            success: true,
            message: 'Rental request deleted successfully.',
        };
    }


    // ============================================================
    // GET REQUESTS BY TENANT ID
    // ============================================================

    async findByTenantId(
        tenantId: number,
    ) {
        const requests = await this.rentalRepository.find({
            where: { tenant_id: tenantId },
            order: { created_at: 'DESC' },
        });
        return {
            success: true,
            message: 'Rental requests retrieved successfully.',
            data: requests,
        };
    }
}