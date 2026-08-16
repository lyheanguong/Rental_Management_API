import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RentalRequest } from './entities/rental-request.entity';
import { CreateRentalRequestDto } from './dto/create-rental-request.dto';
import { UpdateRentalRequestDto } from './dto/update-rental-request.dto';

@Injectable()
export class RentalRequestsService {
    constructor(
        @InjectRepository(RentalRequest)
        private readonly rentalRepository: Repository<RentalRequest>,
    ) { }

    private async findRentalOrFail(
        id: number,
    ): Promise<RentalRequest> {
        const rental = await this.rentalRepository.findOne({
            where: { id },
        });

        if (!rental) {
            throw new NotFoundException(
                'Rental request not found',
            );
        }

        return rental;
    }

    async findAll() {
        const rentals = await this.rentalRepository.find();

        return {
            success: true,
            message: 'Rental requests retrieved successfully.',
            data: rentals,
        };
    }

    async findOne(id: number) {
        const rental = await this.rentalRepository
            .createQueryBuilder('request')

            // ============================================
            // PROPERTY
            // ============================================
            .leftJoin(
                'properties',
                'property',
                'property.id = request.property_id',
            )

            // ============================================
            // TENANT
            // ============================================
            .leftJoin(
                'users',
                'tenant',
                'tenant.id = request.tenant_id',
            )

            // ============================================
            // OWNER
            // ============================================
            .leftJoin(
                'users',
                'owner',
                'owner.id = property.owner_id',
            )

            .select([
                // ============================================
                // RENTAL REQUEST
                // ============================================
                'request.id AS request_id',
                'request.property_id AS request_property_id',
                'request.tenant_id AS request_tenant_id',
                'request.start_date AS request_start_date',
                'request.end_date AS request_end_date',
                'request.message AS request_message',
                'request.status AS request_status',
                'request.created_at AS request_created_at',
                'request.updated_at AS request_updated_at',

                // ============================================
                // PROPERTY
                // ============================================
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

                // ============================================
                // TENANT
                // ============================================
                'tenant.id AS tenant_id',
                'tenant.full_name AS tenant_full_name',
                'tenant.email AS tenant_email',
                'tenant.phone AS tenant_phone',
                'tenant.avatar AS tenant_avatar',
                'tenant.role AS tenant_role',
                'tenant.status AS tenant_status',

                // ============================================
                // OWNER
                // ============================================
                'owner.id AS owner_id',
                'owner.full_name AS owner_full_name',
                'owner.email AS owner_email',
                'owner.phone AS owner_phone',
                'owner.avatar AS owner_avatar',
                'owner.role AS owner_role',
                'owner.status AS owner_status',
            ])

            .where('request.id = :id', {
                id,
            })

            .getRawOne();

        if (!rental) {
            throw new NotFoundException(
                'Rental request not found',
            );
        }

        return {
            success: true,
            message: 'Rental request with full information retrieved successfully.',
            data: rental,
        };
    }

    async create(dto: CreateRentalRequestDto) {
        const rental = this.rentalRepository.create(dto);

        const saved = await this.rentalRepository.save(rental);

        return {
            success: true,
            message: 'Rental request created successfully.',
            data: saved,
        };
    }

    async update(
        id: number,
        dto: UpdateRentalRequestDto,
    ) {
        const rental = await this.findRentalOrFail(id);

        Object.assign(rental, dto);

        const updated = await this.rentalRepository.save(rental);

        return {
            success: true,
            message: 'Rental request updated successfully.',
            data: updated,
        };
    }

    async remove(id: number) {
        const rental = await this.findRentalOrFail(id);

        await this.rentalRepository.remove(rental);

        return {
            success: true,
            message: 'Rental request deleted successfully.',
        };
    }

    async findByTenantId(tenantId: number) {
        const requests = await this.rentalRepository.find({
            where: {
                tenant_id: tenantId,
            },
            order: {
                created_at: 'DESC',
            },
        });

        return {
            success: true,
            message: 'Rental requests retrieved successfully.',
            data: requests,
        };
    }
}