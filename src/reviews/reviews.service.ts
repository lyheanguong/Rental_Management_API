import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/reviews.entity';

@Injectable()
export class ReviewsService {
    constructor(
        @InjectRepository(Review)
        private readonly reviewRepository: Repository<Review>,
    ) { }

    // FIND REVIEW OR THROW ERROR
    private async findReviewOrFail(id: number): Promise<Review> {
        const review = await this.reviewRepository.findOne({
            where: { id }
        });
        if (!review) {
            throw new NotFoundException('Review not found');
        }
        return review;
    }

    // GET ALL REVIEWS
    async findAll() {
        const reviews = await this.reviewRepository.find({
            order: { created_at: 'DESC' },
        });
        return {
            success: true,
            message: 'Reviews retrieved successfully.',
            data: reviews,
        };
    }

    // GET REVIEWS BY PROPERTY ID
    async findByPropertyId(propertyId: number) {
        const reviews = await this.reviewRepository.find({
            where: { property_id: propertyId },
            order: { created_at: 'DESC' },
        });
        return {
            success: true,
            message: 'Reviews retrieved successfully.',
            data: reviews,
        };
    }

    // GET REVIEW BY ID
    async findOne(id: number) {
        const review = await this.findReviewOrFail(id);
        return {
            success: true,
            message: 'Review retrieved successfully.',
            data: review,
        };
    }

    // CREATE REVIEW
    async create(dto: CreateReviewDto) {
        const review = this.reviewRepository.create(dto);
        const saved = await this.reviewRepository.save(review);
        return {
            success: true,
            message: 'Review created successfully.',
            data: saved,
        };
    }

    // UPDATE REVIEW
    async update(id: number, dto: UpdateReviewDto) {
        const review = await this.findReviewOrFail(id);
        Object.assign(
            review,
            dto,
        );
        const updated = await this.reviewRepository.save(review);
        return {
            success: true,
            message: 'Review updated successfully.',
            data: updated,
        };
    }
    // DELETE REVIEW
    async remove(id: number) {
        const review = await this.findReviewOrFail(id);
        await this.reviewRepository.remove(review);
        return {
            success: true,
            message: 'Review deleted successfully.',
        };
    }
}