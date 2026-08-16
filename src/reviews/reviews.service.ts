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

    private async findReviewOrFail(
        id: number,
    ): Promise<Review> {
        const review = await this.reviewRepository.findOne({
            where: { id },
        });

        if (!review) {
            throw new NotFoundException(
                'Review not found',
            );
        }

        return review;
    }

    async findAll() {
        const reviews = await this.reviewRepository.find();

        return {
            success: true,
            message: 'Reviews retrieved successfully.',
            data: reviews,
        };
    }

    async findOne(id: number) {
        const review = await this.findReviewOrFail(id);

        return {
            success: true,
            message: 'Review retrieved successfully.',
            data: review,
        };
    }

    async create(dto: CreateReviewDto) {
        const review =
            this.reviewRepository.create(dto);

        const saved =
            await this.reviewRepository.save(review);

        return {
            success: true,
            message: 'Review created successfully.',
            data: saved,
        };
    }

    async update(
        id: number,
        dto: UpdateReviewDto,
    ) {
        const review =
            await this.findReviewOrFail(id);

        Object.assign(review, dto);

        const updated =
            await this.reviewRepository.save(review);

        return {
            success: true,
            message: 'Review updated successfully.',
            data: updated,
        };
    }

    async remove(id: number) {
        const review =
            await this.findReviewOrFail(id);

        await this.reviewRepository.remove(review);

        return {
            success: true,
            message: 'Review deleted successfully.',
        };
    }
}