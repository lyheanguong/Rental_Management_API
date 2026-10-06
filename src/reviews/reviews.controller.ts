import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Controller('reviews')
export class ReviewsController {
    constructor(
        private readonly reviewsService: ReviewsService,
    ) { }

    // =========================================
    // GET ALL REVIEWS
    // GET /reviews
    // =========================================
    @Get()
    findAll() {
        return this.reviewsService.findAll();
    }

    // =========================================
    // GET REVIEWS BY PROPERTY ID
    // GET /reviews/property/:propertyId
    // =========================================
    @Get('property/:propertyId')
    findByPropertyId(
        @Param('propertyId', ParseIntPipe) propertyId: number,
    ) {
        return this.reviewsService.findByPropertyId(propertyId);
    }

    // =========================================
    // GET REVIEW BY ID
    // GET /reviews/:id
    // =========================================
    @Get(':id')
    findOne(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.reviewsService.findOne(id);
    }

    // =========================================
    // CREATE REVIEW
    // POST /reviews
    // =========================================
    @Post()
    create(
        @Body() dto: CreateReviewDto,
    ) {
        return this.reviewsService.create(dto);
    }

    // =========================================
    // UPDATE REVIEW
    // PATCH /reviews/:id
    // =========================================
    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateReviewDto,
    ) {
        return this.reviewsService.update(id, dto);
    }

    // =========================================
    // DELETE REVIEW
    // DELETE /reviews/:id
    // =========================================
    @Delete(':id')
    remove(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.reviewsService.remove(id);
    }
}