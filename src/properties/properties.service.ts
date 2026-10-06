import { Injectable, NotFoundException, } from '@nestjs/common';
import { InjectRepository, } from '@nestjs/typeorm';
import { Repository, } from 'typeorm';
import { Property } from './entities/property.entity';
import { CreatePropertyDto, } from './dto/create-property.dto';
import { UpdatePropertyDto, } from './dto/update-property.dto';

@Injectable()
export class PropertiesService {
    constructor(
        @InjectRepository(Property)
        private readonly propertyRepository:
            Repository<Property>,
    ) { }

    // ==========================================
    // GET ALL
    // ==========================================

    async findAll() {
        const properties = await this.propertyRepository.find();
        return {
            success: true,
            message: 'Properties retrieved successfully',
            count: properties.length,
            data: properties,
        };
    }

    // ==========================================
    // GET ONE
    // ==========================================

    // ==========================================
    // GET ONE WITH FULL INFO
    // ==========================================

    async findOne(id: number) {
        const property = await this.propertyRepository
            .createQueryBuilder('property')

            // =========================
            // PROPERTY OWNER
            // =========================
            .leftJoin(
                'users',
                'owner',
                'owner.id = property.owner_id',
            )

            .select([
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
                'property.property_code AS property_code',
                'property.image AS property_image',
                'property.created_at AS property_created_at',
                'property.updated_at AS property_updated_at',

                // =========================
                // OWNER
                // =========================
                'owner.id AS owner_id',
                'owner.full_name AS owner_full_name',
                'owner.email AS owner_email',
                'owner.phone AS owner_phone',
                'owner.avatar AS owner_avatar',
                'owner.role AS owner_role',
            ])

            // =========================
            // PROPERTY ID
            // =========================
            .where('property.id = :id', { id })

            .getRawOne();

        if (!property) {
            throw new NotFoundException(
                `Property with ID ${id} not found`,
            );
        }

        return {
            success: true,
            message: 'Property retrieved successfully',
            data: property,
        };
    }

    // ==========================================
    // CREATE
    // ==========================================

    async create(
        createPropertyDto: CreatePropertyDto & { image: string; },
    ) {
        const property = this.propertyRepository.create(createPropertyDto);
        const savedProperty = await this.propertyRepository.save(property);
        return {
            success: true,
            message: 'Property created successfully',
            data: savedProperty,
        };
    }

    // ============================================
    // Get all properties rented by tenant
    // ============================================
    async findByTenantId(tenantId: number) {
        const properties = await this.propertyRepository.createQueryBuilder('property')

            // Rental contracts
            .innerJoin(
                'rental_contracts',
                'contract',
                'contract.property_id = property.id',
            )

            // Tenant
            .innerJoin(
                'users',
                'tenant',
                'tenant.id = contract.tenant_id',
            )

            .select([
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
                'property.property_code AS property_code',
                'property.image AS property_image',
                'property.created_at AS property_created_at',
                'property.updated_at AS property_updated_at',

                // =========================
                // RENTAL CONTRACT
                // =========================
                'contract.id AS contract_id',
                'contract.request_id AS contract_request_id',
                'contract.tenant_id AS contract_tenant_id',
                'contract.owner_id AS contract_owner_id',
                'contract.start_date AS contract_start_date',
                'contract.end_date AS contract_end_date',
                'contract.monthly_price AS contract_monthly_price',
                'contract.deposit_amount AS contract_deposit_amount',
                'contract.status AS contract_status',
                'contract.created_at AS contract_created_at',
            ])

            // Only this tenant
            .where('contract.tenant_id = :tenantId', {
                tenantId,
            })

            .orderBy('contract.created_at', 'DESC')

            .getRawMany();

        return {
            success: true,
            message: 'Tenant rented properties retrieved successfully.',
            data: properties,
        };
    }

    // ==========================================
    // GET ALL PROPERTIES BY OWNER ID
    // ==========================================

    async findByOwnerId(ownerId: number) {
        const properties =
            await this.propertyRepository.find({
                where: { owner_id: ownerId },
                order: { created_at: 'DESC' },
            });
        return {
            success: true,
            message: 'Owner properties retrieved successfully',
            count: properties.length,
            data: properties,
        };
    }

    // ==========================================
    // UPDATE
    // ==========================================

    async update(id: number, updatePropertyDto: UpdatePropertyDto) {
        const existingProperty =
            await this.propertyRepository.findOne({
                where: {
                    id,
                },
            });

        if (!existingProperty) {
            throw new NotFoundException(`Property with ID ${id} not found`);
        }

        Object.assign(
            existingProperty,
            updatePropertyDto,
        );

        const updatedProperty = await this.propertyRepository.save(existingProperty);

        return {
            success: true,
            message: 'Property updated successfully',
            data: updatedProperty,
        };
    }

    // ==========================================
    // DELETE
    // ==========================================

    async remove(id: number) {
        const property =
            await this.propertyRepository.findOne({
                where: { id },
            });

        if (!property) {
            throw new NotFoundException(
                `Property with ID ${id} not found`,
            );
        }

        await this.propertyRepository.remove(property);

        return {
            success: true,
            message: 'Property deleted successfully',
        };
    }
}