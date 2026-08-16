import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { PropertyImage } from './entities/property-image.entity';

import { CreatePropertyImageDto } from './dto/create-property-image.dto';
import { UpdatePropertyImageDto } from './dto/update-property-image.dto';

@Injectable()
export class PropertyImagesService {
    constructor(
        @InjectRepository(PropertyImage)
        private readonly imageRepository: Repository<PropertyImage>,
    ) { }

    // ==========================================
    // Create one image
    // ==========================================
    async create(
        dto: CreatePropertyImageDto,
    ) {
        // If this image should be cover
        if (dto.is_cover === true) {
            await this.imageRepository.update(
                {
                    property_id: dto.property_id,
                },
                {
                    is_cover: false,
                },
            );
        }

        const image =
            this.imageRepository.create(dto);

        const saved =
            await this.imageRepository.save(image);

        return {
            success: true,
            message: 'Property image uploaded successfully',
            data: saved,
        };
    }

    // ==========================================
    // Create multiple images
    // ==========================================
    async createMultiple(
        propertyId: number,
        files: Express.Multer.File[],
    ) {
        // Check files
        if (!files || files.length === 0) {
            throw new BadRequestException(
                'No images uploaded',
            );
        }

        // Check whether property already has a cover
        const existingCover =
            await this.imageRepository.findOne({
                where: {
                    property_id: propertyId,
                    is_cover: true,
                },
            });

        const images = files.map(
            (file, index) => {
                return this.imageRepository.create({
                    property_id: propertyId,

                    image_url:
                        `properties/${file.filename}`,

                    // First image becomes cover
                    // only if there is no existing cover
                    is_cover:
                        !existingCover &&
                        index === 0,
                });
            },
        );

        const saved =
            await this.imageRepository.save(images);

        return {
            success: true,
            message:
                'Property images uploaded successfully',
            data: saved,
        };
    }

    // ==========================================
    // Get all images by property
    // ==========================================
    async findByProperty(
        propertyId: number,
    ) {
        const images =
            await this.imageRepository.find({
                where: {
                    property_id: propertyId,
                },

                order: {
                    is_cover: 'DESC',
                    id: 'ASC',
                },
            });

        return {
            success: true,
            data: images,
        };
    }

    // ==========================================
    // Delete image
    // ==========================================
    async remove(id: number) {
        const image =
            await this.imageRepository.findOne({
                where: {
                    id,
                },
            });

        if (!image) {
            throw new NotFoundException(
                `Image ${id} not found`,
            );
        }

        await this.imageRepository.delete(id);

        return {
            success: true,
            message:
                'Property image deleted successfully',
        };
    }

    // ==========================================
    // Update image
    // ==========================================
    async update(
        id: number,
        dto: UpdatePropertyImageDto,
    ) {
        const image =
            await this.imageRepository.findOne({
                where: {
                    id,
                },
            });

        if (!image) {
            throw new NotFoundException(
                `Image ${id} not found`,
            );
        }

        // If this image becomes cover
        if (dto.is_cover === true) {
            // Remove cover from all images
            // belonging to this property
            await this.imageRepository.update(
                {
                    property_id:
                        image.property_id,
                },
                {
                    is_cover: false,
                },
            );
        }

        Object.assign(image, dto);

        const updated =
            await this.imageRepository.save(image);

        return {
            success: true,
            message:
                'Property image updated successfully',
            data: updated,
        };
    }
}