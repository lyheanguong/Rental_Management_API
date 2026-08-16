import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import {
    InjectRepository,
} from '@nestjs/typeorm';

import {
    Repository,
} from 'typeorm';

import { Property } from './entities/property.entity';

import {
    CreatePropertyDto,
} from './dto/create-property.dto';

import {
    UpdatePropertyDto,
} from './dto/update-property.dto';

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
        const properties =
            await this.propertyRepository.find();

        return {
            success: true,
            message:
                'Properties retrieved successfully',
            count: properties.length,
            data: properties,
        };
    }

    // ==========================================
    // GET ONE
    // ==========================================

    async findOne(id: number) {
        const property =
            await this.propertyRepository.findOne({
                where: {
                    id,
                },
            });

        if (!property) {
            throw new NotFoundException(
                `Property with ID ${id} not found`,
            );
        }

        return {
            success: true,
            message:
                'Property retrieved successfully',
            data: property,
        };
    }

    // ==========================================
    // CREATE
    // ==========================================

    async create(
        createPropertyDto: CreatePropertyDto & {
            image: string;
        },
    ) {
        const property =
            this.propertyRepository.create(
                createPropertyDto,
            );

        const savedProperty =
            await this.propertyRepository.save(
                property,
            );

        return {
            success: true,
            message:
                'Property created successfully',
            data: savedProperty,
        };
    }

    // ==========================================
    // UPDATE
    // ==========================================

    async update(
        id: number,
        updatePropertyDto: UpdatePropertyDto,
    ) {
        const existingProperty =
            await this.propertyRepository.findOne({
                where: {
                    id,
                },
            });

        if (!existingProperty) {
            throw new NotFoundException(
                `Property with ID ${id} not found`,
            );
        }

        Object.assign(
            existingProperty,
            updatePropertyDto,
        );

        const updatedProperty =
            await this.propertyRepository.save(
                existingProperty,
            );

        return {
            success: true,
            message:
                'Property updated successfully',
            data: updatedProperty,
        };
    }

    // ==========================================
    // DELETE
    // ==========================================

    async remove(id: number) {
        const property =
            await this.propertyRepository.findOne({
                where: {
                    id,
                },
            });

        if (!property) {
            throw new NotFoundException(
                `Property with ID ${id} not found`,
            );
        }

        await this.propertyRepository.remove(
            property,
        );

        return {
            success: true,
            message:
                'Property deleted successfully',
        };
    }
}