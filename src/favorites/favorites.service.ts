import {
    Injectable,
    ConflictException,
    NotFoundException,
} from '@nestjs/common';

import {
    InjectRepository,
} from '@nestjs/typeorm';

import {
    Repository,
} from 'typeorm';

import { Favorite } from './entities/favorite.entity';
import { CreateFavoriteDto } from './dto/create-favorite.dto';

@Injectable()
export class FavoritesService {
    constructor(
        @InjectRepository(Favorite)
        private readonly favoriteRepository: Repository<Favorite>,
    ) { }

    // ==========================================
    // ADD FAVORITE
    // ==========================================

    async create(createFavoriteDto: CreateFavoriteDto) {
        const { user_id, property_id } = createFavoriteDto;

        const existingFavorite =
            await this.favoriteRepository.findOne({
                where: {
                    user_id,
                    property_id,
                },
            });

        if (existingFavorite) {
            throw new ConflictException(
                'This property is already in your favorites.',
            );
        }

        const favorite =
            this.favoriteRepository.create({
                user_id,
                property_id,
            });

        const savedFavorite =
            await this.favoriteRepository.save(favorite);

        return {
            success: true,
            message: 'Property added to favorites successfully.',
            data: {
                id: savedFavorite.id,
                user_id: savedFavorite.user_id,
                property_id: savedFavorite.property_id,
                isFavorite: true,
                created_at: savedFavorite.created_at,
            },
        };
    }

    // ==========================================
    // GET ALL FAVORITES
    // ==========================================

    async findAll() {
        const favorites =
            await this.favoriteRepository.find({
                order: {
                    created_at: 'DESC',
                },
            });

        return {
            success: true,
            data: favorites,
        };
    }

    // ==========================================
    // GET FAVORITES BY USER
    // ==========================================

    async findByUserId(userId: number) {
        const favorites =
            await this.favoriteRepository.find({
                where: {
                    user_id: userId,
                },
                order: {
                    created_at: 'DESC',
                },
            });

        return {
            success: true,
            data: favorites,
        };
    }

    // ==========================================
    // CHECK FAVORITE
    // ==========================================

    async checkFavorite(
        userId: number,
        propertyId: number,
    ) {
        const favorite =
            await this.favoriteRepository.findOne({
                where: {
                    user_id: userId,
                    property_id: propertyId,
                },
            });

        return {
            success: true,
            isFavorite: !!favorite,
            data: favorite || null,
        };
    }

    // ==========================================
    // REMOVE FAVORITE
    // ==========================================

    async remove(
        userId: number,
        propertyId: number,
    ) {
        const favorite =
            await this.favoriteRepository.findOne({
                where: {
                    user_id: userId,
                    property_id: propertyId,
                },
            });

        if (!favorite) {
            throw new NotFoundException(
                'Favorite not found',
            );
        }

        await this.favoriteRepository.remove(favorite);

        return {
            success: true,
            message: 'Property removed from favorites successfully.',
        };
    }
}