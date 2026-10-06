import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RentalContract } from './entities/rental-contract.entity';
import { CreateRentalContractDto } from './dto/create-rental-contract.dto';
import { UpdateRentalContractDto } from './dto/update-rental-contract.dto';
import { Property } from '../properties/entities/property.entity';

@Injectable()
export class RentalContractsService {

    constructor(
        @InjectRepository(RentalContract)
        private readonly contractRepository: Repository<RentalContract>,

        @InjectRepository(Property)
        private readonly propertyRepository: Repository<Property>,
    ) { }

    // PRIVATE METHOD
    private async findContractOrFail(id: number): Promise<RentalContract> {
        const contract = await this.contractRepository.findOne({
            where: { id },
        });
        if (!contract) { throw new NotFoundException('Rental contract not found'); }
        return contract;
    }

    // GET ALL CONTRACTS
    async findAll() {
        const contracts = await this.contractRepository
            .createQueryBuilder('contract')
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
                // CONTRACT
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
                'tenant.created_at AS tenant_created_at',
                'tenant.updated_at AS tenant_updated_at',
                // OWNER
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
            .orderBy('contract.created_at', 'DESC').getRawMany();
        return {
            success: true,
            message: 'Rental contracts retrieved successfully.',
            data: contracts,
        };
    }

    // GET CONTRACT BY ID
    async findOne(id: number) {
        const contract = await this.contractRepository
            .createQueryBuilder('contract')
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
                // CONTRACT
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
                'tenant.created_at AS tenant_created_at',
                'tenant.updated_at AS tenant_updated_at',
                // OWNER
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
            .where('contract.id = :id', { id }).getRawOne();
        if (!contract) {
            throw new NotFoundException('Rental contract not found');
        }
        return {
            success: true,
            message: 'Rental contract retrieved successfully.',
            data: contract,
        };
    }

    // GET CONTRACTS BY TENANT ID
    async findByTenantId(tenantId: number) {
        const contracts = await this.contractRepository.createQueryBuilder('contract')
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

                'tenant.id AS tenant_id',
                'tenant.full_name AS tenant_full_name',
                'tenant.email AS tenant_email',
                'tenant.phone AS tenant_phone',
                'tenant.avatar AS tenant_avatar',
                'tenant.role AS tenant_role',
                'tenant.status AS tenant_status',
                'tenant.created_at AS tenant_created_at',
                'tenant.updated_at AS tenant_updated_at',

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
            .where('contract.tenant_id = :tenantId', { tenantId })
            .orderBy('contract.created_at', 'DESC')
            .getRawMany();
        return {
            success: true,
            message: 'Tenant contracts retrieved successfully.',
            data: contracts,
        };
    }

    // GET CONTRACTS BY OWNER ID
    async findByOwnerId(ownerId: number) {
        const contracts = await this.contractRepository.createQueryBuilder('contract')
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

                'tenant.id AS tenant_id',
                'tenant.full_name AS tenant_full_name',
                'tenant.email AS tenant_email',
                'tenant.phone AS tenant_phone',
                'tenant.avatar AS tenant_avatar',
                'tenant.role AS tenant_role',
                'tenant.status AS tenant_status',
                'tenant.created_at AS tenant_created_at',
                'tenant.updated_at AS tenant_updated_at',

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
            .where('contract.owner_id = :ownerId', { ownerId },)
            .orderBy('contract.created_at', 'DESC',)
            .getRawMany();
        return {
            success: true,
            message: 'Owner contracts retrieved successfully.',
            data: contracts,
        };
    }

    // GET CONTRACTS BY PROPERTY ID
    async findByPropertyId(propertyId: number) {
        const contracts = await this.contractRepository
            .createQueryBuilder('contract')
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

                'tenant.id AS tenant_id',
                'tenant.full_name AS tenant_full_name',
                'tenant.email AS tenant_email',
                'tenant.phone AS tenant_phone',
                'tenant.avatar AS tenant_avatar',
                'tenant.role AS tenant_role',
                'tenant.status AS tenant_status',
                'tenant.created_at AS tenant_created_at',
                'tenant.updated_at AS tenant_updated_at',

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
            .where('contract.property_id = :propertyId', { propertyId })
            .orderBy('contract.created_at', 'DESC')
            .getRawMany();
        return {
            success: true,
            message: 'Property contracts retrieved successfully.',
            data: contracts,
        };
    }

    // CREATE CONTRACT
    async create(dto: CreateRentalContractDto) {
        // CHECK PROPERTY EXISTS
        const property =
            await this.propertyRepository.findOne({
                where: { id: dto.property_id },
            });
        if (!property) {
            throw new NotFoundException(
                `Property with ID ${dto.property_id} not found`,
            );
        }
        // CHECK PROPERTY ALREADY HAS CONTRACT
        const existingContract =
            await this.contractRepository.findOne({
                where: { property_id: dto.property_id },
            });
        if (existingContract) {
            throw new ConflictException(`Property with ID ${dto.property_id} already has a rental contract.`);
        }
        // CREATE CONTRACT
        const contract = this.contractRepository.create(dto);
        const saved = await this.contractRepository.save(contract);
        // ACTIVE CONTRACT = PROPERTY RENTED
        if (saved.status === 'ACTIVE') {
            property.availability_status = 'rented';
            await this.propertyRepository.save(property);
        }
        return {
            success: true,
            message: 'Rental contract created successfully.',
            data: saved,
        };
    }

    // UPDATE CONTRACT
    async update(id: number, dto: UpdateRentalContractDto) {
        // FIND CONTRACT
        const contract = await this.findContractOrFail(id);
        // SAVE OLD VALUES
        const oldStatus = contract.status;
        const oldPropertyId = contract.property_id;
        // PROPERTY ID CANNOT BE EMPTY
        if (
            oldPropertyId === undefined ||
            oldPropertyId === null
        ) {
            throw new NotFoundException(
                `Property ID is missing from rental contract ${id}`,
            );
        }
        // IF PROPERTY ID IS BEING CHANGED CHECK FOR DUPLICATE CONTRACT
        if (
            dto.property_id !== undefined &&
            dto.property_id !== oldPropertyId
        ) {
            const newProperty =
                await this.propertyRepository.findOne({
                    where: { id: dto.property_id },
                });
            if (!newProperty) {
                throw new NotFoundException(
                    `Property with ID ${dto.property_id} not found`,
                );
            }
            const existingContract =
                await this.contractRepository.findOne({
                    where: { property_id: dto.property_id },
                });
            if (existingContract) {
                throw new ConflictException(
                    `Property with ID ${dto.property_id} already has a rental contract.`,
                );
            }
        }

        // UPDATE ONLY PROVIDED VALUES
        if (dto.request_id !== undefined) {
            contract.request_id = dto.request_id;
        }
        if (dto.property_id !== undefined) {
            contract.property_id = dto.property_id;
        }
        if (dto.tenant_id !== undefined) {
            contract.tenant_id = dto.tenant_id;
        }
        if (dto.owner_id !== undefined) {
            contract.owner_id = dto.owner_id;
        }
        if (dto.start_date !== undefined) {
            contract.start_date = dto.start_date;
        }
        if (dto.end_date !== undefined) {
            contract.end_date = dto.end_date;
        }
        if (dto.monthly_price !== undefined) {
            contract.monthly_price = dto.monthly_price;
        }
        if (dto.deposit_amount !== undefined) {
            contract.deposit_amount = dto.deposit_amount;
        }
        if (dto.status !== undefined) {
            contract.status = dto.status;
        }
        // SAVE CONTRACT
        const updated = await this.contractRepository.save(contract);
        // PROPERTY STATUS
        const finalPropertyId = contract.property_id;
        if (dto.status !== undefined && dto.status !== oldStatus) {
            const property =
                await this.propertyRepository.findOne({
                    where: { id: finalPropertyId },
                });
            if (!property) {
                throw new NotFoundException(`Property with ID ${finalPropertyId} not found`);
            }
            // ACTIVE
            if (dto.status === 'ACTIVE') {
                property.availability_status = 'rented';
            }
            // INACTIVE
            else if (dto.status === 'INACTIVE') {
                property.availability_status = 'available';
            }
            await this.propertyRepository.save(property);
        }
        // IF PROPERTY WAS CHANGED UPDATE OLD PROPERTY
        if (
            dto.property_id !== undefined &&
            dto.property_id !== oldPropertyId
        ) {
            const oldProperty =
                await this.propertyRepository.findOne({
                    where: { id: oldPropertyId },
                });
            if (oldProperty) {
                oldProperty.availability_status = 'available';
                await this.propertyRepository.save(oldProperty);
            }
            // New property should be rented if the contract is active.
            if (contract.status === 'ACTIVE') {
                const newProperty =
                    await this.propertyRepository.findOne({
                        where: { id: dto.property_id },
                    });
                if (newProperty) {
                    newProperty.availability_status = 'rented';
                    await this.propertyRepository.save(newProperty);
                }
            }
        }
        return {
            success: true,
            message: 'Rental contract updated successfully.',
            data: updated,
        };
    }

    // DELETE CONTRACT
    async remove(id: number) {
        const contract = await this.findContractOrFail(id);
        await this.contractRepository.remove(contract);
        return {
            success: true,
            message: 'Rental contract deleted successfully.',
        };
    }
}