
import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RentalContract } from './entities/rental-contract.entity';
import { CreateRentalContractDto } from './dto/create-rental-contract.dto';
import { UpdateRentalContractDto } from './dto/update-rental-contract.dto';

@Injectable()
export class RentalContractsService {
    constructor(
        @InjectRepository(RentalContract)
        private readonly contractRepository: Repository<RentalContract>,
    ) { }

    // ============================================================
    // PRIVATE METHOD
    // ============================================================

    private async findContractOrFail(
        id: number,
    ): Promise<RentalContract> {
        const contract = await this.contractRepository.findOne({
            where: {
                id,
            },
        });

        if (!contract) {
            throw new NotFoundException(
                'Rental contract not found',
            );
        }

        return contract;
    }

    // ============================================================
    // GET ALL CONTRACTS
    //
    // Contract + Property + Tenant + Owner
    // ============================================================

    async findAll() {
        const contracts = await this.contractRepository
            .createQueryBuilder('contract')

            // ----------------------------------------------------------
            // JOIN PROPERTY
            // ----------------------------------------------------------

            .leftJoin(
                'properties',
                'property',
                'property.id = contract.property_id',
            )

            // ----------------------------------------------------------
            // JOIN TENANT
            // ----------------------------------------------------------

            .leftJoin(
                'users',
                'tenant',
                'tenant.id = contract.tenant_id',
            )

            // ----------------------------------------------------------
            // JOIN OWNER
            // ----------------------------------------------------------

            .leftJoin(
                'users',
                'owner',
                'owner.id = contract.owner_id',
            )

            // ----------------------------------------------------------
            // SELECT
            // ----------------------------------------------------------

            .select([
                // ========================================================
                // CONTRACT
                // ========================================================

                'contract.id AS contract_id',
                'contract.request_id AS request_id',
                'contract.property_id AS contract_property_id',
                'contract.tenant_id AS contract_tenant_id',
                'contract.owner_id AS contract_owner_id',
                'contract.start_date AS start_date',
                'contract.end_date AS end_date',
                'contract.monthly_price AS monthly_price',
                'contract.deposit_amount AS deposit_amount',
                'contract.status AS contract_status',
                'contract.created_at AS contract_created_at',

                // ========================================================
                // PROPERTY
                // ========================================================

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

                // ========================================================
                // TENANT
                // ========================================================

                'tenant.id AS tenant_id',
                'tenant.full_name AS tenant_full_name',
                'tenant.email AS tenant_email',
                'tenant.phone AS tenant_phone',
                'tenant.avatar AS tenant_avatar',
                'tenant.role AS tenant_role',
                'tenant.status AS tenant_status',
                'tenant.created_at AS tenant_created_at',
                'tenant.updated_at AS tenant_updated_at',

                // ========================================================
                // OWNER
                // ========================================================

                'owner.id AS owner_id',
                'owner.full_name AS owner_full_name',
                'owner.email AS owner_email',
                'owner.phone AS owner_phone',
                'owner.avatar AS owner_avatar',
                'owner.role AS owner_role',
                'owner.status AS owner_status',
                'owner.created_at AS owner_created_at',
                'owner.updated_at AS owner_updated_at',
            ])

            // ----------------------------------------------------------
            // ORDER
            // ----------------------------------------------------------

            .orderBy(
                'contract.created_at',
                'DESC',
            )

            .getRawMany();

        return {
            success: true,
            message:
                'Rental contracts retrieved successfully.',
            data: contracts,
        };
    }

    // ============================================================
    // GET CONTRACT BY ID
    //
    // Contract + Property + Tenant + Owner
    // ============================================================

    async findOne(id: number) {
        const contract = await this.contractRepository
            .createQueryBuilder('contract')

            // ----------------------------------------------------------
            // JOIN PROPERTY
            // ----------------------------------------------------------

            .leftJoin(
                'properties',
                'property',
                'property.id = contract.property_id',
            )

            // ----------------------------------------------------------
            // JOIN TENANT
            // ----------------------------------------------------------

            .leftJoin(
                'users',
                'tenant',
                'tenant.id = contract.tenant_id',
            )

            // ----------------------------------------------------------
            // JOIN OWNER
            // ----------------------------------------------------------

            .leftJoin(
                'users',
                'owner',
                'owner.id = contract.owner_id',
            )

            // ----------------------------------------------------------
            // SELECT
            // ----------------------------------------------------------

            .select([
                // Contract
                'contract.id AS contract_id',
                'contract.request_id AS request_id',
                'contract.property_id AS contract_property_id',
                'contract.tenant_id AS contract_tenant_id',
                'contract.owner_id AS contract_owner_id',
                'contract.start_date AS start_date',
                'contract.end_date AS end_date',
                'contract.monthly_price AS monthly_price',
                'contract.deposit_amount AS deposit_amount',
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
                'tenant.created_at AS tenant_created_at',
                'tenant.updated_at AS tenant_updated_at',

                // Owner
                'owner.id AS owner_id',
                'owner.full_name AS owner_full_name',
                'owner.email AS owner_email',
                'owner.phone AS owner_phone',
                'owner.avatar AS owner_avatar',
                'owner.role AS owner_role',
                'owner.status AS owner_status',
                'owner.created_at AS owner_created_at',
                'owner.updated_at AS owner_updated_at',
            ])

            // ----------------------------------------------------------
            // WHERE
            // ----------------------------------------------------------

            .where(
                'contract.id = :id',
                {
                    id,
                },
            )

            .getRawOne();

        // ----------------------------------------------------------
        // NOT FOUND
        // ----------------------------------------------------------

        if (!contract) {
            throw new NotFoundException(
                'Rental contract not found',
            );
        }

        return {
            success: true,
            message:
                'Rental contract retrieved successfully.',
            data: contract,
        };
    }

    // ============================================================
    // GET CONTRACTS BY TENANT ID
    //
    // Contract + Property + Tenant + Owner
    // ============================================================

    async findByTenantId(
        tenantId: number,
    ) {
        const contracts = await this.contractRepository
            .createQueryBuilder('contract')

            // ----------------------------------------------------------
            // JOIN PROPERTY
            // ----------------------------------------------------------

            .leftJoin(
                'properties',
                'property',
                'property.id = contract.property_id',
            )

            // ----------------------------------------------------------
            // JOIN TENANT
            // ----------------------------------------------------------

            .leftJoin(
                'users',
                'tenant',
                'tenant.id = contract.tenant_id',
            )

            // ----------------------------------------------------------
            // JOIN OWNER
            // ----------------------------------------------------------

            .leftJoin(
                'users',
                'owner',
                'owner.id = contract.owner_id',
            )

            // ----------------------------------------------------------
            // SELECT
            // ----------------------------------------------------------

            .select([
                // Contract
                'contract.id AS contract_id',
                'contract.request_id AS request_id',
                'contract.property_id AS contract_property_id',
                'contract.tenant_id AS contract_tenant_id',
                'contract.owner_id AS contract_owner_id',
                'contract.start_date AS start_date',
                'contract.end_date AS end_date',
                'contract.monthly_price AS monthly_price',
                'contract.deposit_amount AS deposit_amount',
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
                'tenant.created_at AS tenant_created_at',
                'tenant.updated_at AS tenant_updated_at',

                // Owner
                'owner.id AS owner_id',
                'owner.full_name AS owner_full_name',
                'owner.email AS owner_email',
                'owner.phone AS owner_phone',
                'owner.avatar AS owner_avatar',
                'owner.role AS owner_role',
                'owner.status AS owner_status',
                'owner.created_at AS owner_created_at',
                'owner.updated_at AS owner_updated_at',
            ])

            // ----------------------------------------------------------
            // FILTER
            // ----------------------------------------------------------

            .where(
                'contract.tenant_id = :tenantId',
                {
                    tenantId,
                },
            )

            .orderBy(
                'contract.created_at',
                'DESC',
            )

            .getRawMany();

        return {
            success: true,
            message:
                'Tenant contracts retrieved successfully.',
            data: contracts,
        };
    }

    // ============================================================
    // GET CONTRACTS BY OWNER ID
    //
    // Contract + Property + Tenant + Owner
    // ============================================================

    async findByOwnerId(
        ownerId: number,
    ) {
        const contracts = await this.contractRepository
            .createQueryBuilder('contract')

            // ----------------------------------------------------------
            // JOIN PROPERTY
            // ----------------------------------------------------------

            .leftJoin(
                'properties',
                'property',
                'property.id = contract.property_id',
            )

            // ----------------------------------------------------------
            // JOIN TENANT
            // ----------------------------------------------------------

            .leftJoin(
                'users',
                'tenant',
                'tenant.id = contract.tenant_id',
            )

            // ----------------------------------------------------------
            // JOIN OWNER
            // ----------------------------------------------------------

            .leftJoin(
                'users',
                'owner',
                'owner.id = contract.owner_id',
            )

            // ----------------------------------------------------------
            // SELECT
            // ----------------------------------------------------------

            .select([
                // Contract
                'contract.id AS contract_id',
                'contract.request_id AS request_id',
                'contract.property_id AS contract_property_id',
                'contract.tenant_id AS contract_tenant_id',
                'contract.owner_id AS contract_owner_id',
                'contract.start_date AS start_date',
                'contract.end_date AS end_date',
                'contract.monthly_price AS monthly_price',
                'contract.deposit_amount AS deposit_amount',
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
                'tenant.created_at AS tenant_created_at',
                'tenant.updated_at AS tenant_updated_at',

                // Owner
                'owner.id AS owner_id',
                'owner.full_name AS owner_full_name',
                'owner.email AS owner_email',
                'owner.phone AS owner_phone',
                'owner.avatar AS owner_avatar',
                'owner.role AS owner_role',
                'owner.status AS owner_status',
                'owner.created_at AS owner_created_at',
                'owner.updated_at AS owner_updated_at',
            ])

            // ----------------------------------------------------------
            // FILTER
            // ----------------------------------------------------------

            .where(
                'contract.owner_id = :ownerId',
                {
                    ownerId,
                },
            )

            .orderBy(
                'contract.created_at',
                'DESC',
            )

            .getRawMany();

        return {
            success: true,
            message:
                'Owner contracts retrieved successfully.',
            data: contracts,
        };
    }

    // ============================================================
    // GET CONTRACTS BY PROPERTY ID
    //
    // Contract + Property + Tenant + Owner
    // ============================================================

    async findByPropertyId(
        propertyId: number,
    ) {
        const contracts = await this.contractRepository
            .createQueryBuilder('contract')

            // ----------------------------------------------------------
            // JOIN PROPERTY
            // ----------------------------------------------------------

            .leftJoin(
                'properties',
                'property',
                'property.id = contract.property_id',
            )

            // ----------------------------------------------------------
            // JOIN TENANT
            // ----------------------------------------------------------

            .leftJoin(
                'users',
                'tenant',
                'tenant.id = contract.tenant_id',
            )

            // ----------------------------------------------------------
            // JOIN OWNER
            // ----------------------------------------------------------

            .leftJoin(
                'users',
                'owner',
                'owner.id = contract.owner_id',
            )

            // ----------------------------------------------------------
            // SELECT
            // ----------------------------------------------------------

            .select([
                // Contract
                'contract.id AS contract_id',
                'contract.request_id AS request_id',
                'contract.property_id AS contract_property_id',
                'contract.tenant_id AS contract_tenant_id',
                'contract.owner_id AS contract_owner_id',
                'contract.start_date AS start_date',
                'contract.end_date AS end_date',
                'contract.monthly_price AS monthly_price',
                'contract.deposit_amount AS deposit_amount',
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
                'tenant.created_at AS tenant_created_at',
                'tenant.updated_at AS tenant_updated_at',

                // Owner
                'owner.id AS owner_id',
                'owner.full_name AS owner_full_name',
                'owner.email AS owner_email',
                'owner.phone AS owner_phone',
                'owner.avatar AS owner_avatar',
                'owner.role AS owner_role',
                'owner.status AS owner_status',
                'owner.created_at AS owner_created_at',
                'owner.updated_at AS owner_updated_at',
            ])

            // ----------------------------------------------------------
            // FILTER
            // ----------------------------------------------------------

            .where(
                'contract.property_id = :propertyId',
                {
                    propertyId,
                },
            )

            .orderBy(
                'contract.created_at',
                'DESC',
            )

            .getRawMany();

        return {
            success: true,
            message:
                'Property contracts retrieved successfully.',
            data: contracts,
        };
    }

    // ============================================================
    // CREATE CONTRACT
    // ============================================================

    async create(
        dto: CreateRentalContractDto,
    ) {
        const contract =
            this.contractRepository.create(dto);

        const saved =
            await this.contractRepository.save(contract);

        return {
            success: true,
            message:
                'Rental contract created successfully.',
            data: saved,
        };
    }

    // ============================================================
    // UPDATE CONTRACT
    // ============================================================

    async update(
        id: number,
        dto: UpdateRentalContractDto,
    ) {
        const contract =
            await this.findContractOrFail(id);

        Object.assign(
            contract,
            dto,
        );

        const updated =
            await this.contractRepository.save(contract);

        return {
            success: true,
            message:
                'Rental contract updated successfully.',
            data: updated,
        };
    }

    // ============================================================
    // DELETE CONTRACT
    // ============================================================

    async remove(
        id: number,
    ) {
        const contract =
            await this.findContractOrFail(id);

        await this.contractRepository.remove(
            contract,
        );

        return {
            success: true,
            message:
                'Rental contract deleted successfully.',
        };
    }
}
