import {
    Controller,
    Post,
    Get,
    Delete,
    Body,
    Param,
    ParseIntPipe,
    UseGuards,
} from '@nestjs/common';

import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';

import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';


@ApiTags('Favorites')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('favorites')
export class FavoritesController {

    constructor(
        private readonly favoritesService: FavoritesService,
    ) { }


    // ==========================================
    // ADD FAVORITE
    // POST /favorites
    // ==========================================

    @Post()
    @ApiOperation({
        summary: 'Add property to favorites',
    })
    @ApiResponse({
        status: 201,
        description: 'Property added to favorites successfully',
    })
    @ApiResponse({
        status: 400,
        description: 'Property is already in favorites',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    create(
        @Body()
        createFavoriteDto: CreateFavoriteDto,
    ) {
        return this.favoritesService.create(
            createFavoriteDto,
        );
    }


    // ==========================================
    // GET ALL FAVORITES
    // GET /favorites
    // ==========================================

    @Get()
    @ApiOperation({
        summary: 'Get all favorites',
    })
    @ApiResponse({
        status: 200,
        description: 'Favorites retrieved successfully',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    findAll() {
        return this.favoritesService.findAll();
    }


    // ==========================================
    // GET USER FAVORITES
    // GET /favorites/user/1
    // ==========================================

    @Get('user/:userId')
    @ApiOperation({
        summary: 'Get favorites by user ID',
    })
    @ApiResponse({
        status: 200,
        description: 'User favorites retrieved successfully',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    findByUserId(
        @Param(
            'userId',
            ParseIntPipe,
        )
        userId: number,
    ) {
        return this.favoritesService.findByUserId(
            userId,
        );
    }


    // ==========================================
    // CHECK FAVORITE
    // GET /favorites/check/1/5
    // ==========================================

    @Get('check/:userId/:propertyId')
    @ApiOperation({
        summary: 'Check if property is in user favorites',
    })
    @ApiResponse({
        status: 200,
        description: 'Favorite status retrieved successfully',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    checkFavorite(
        @Param(
            'userId',
            ParseIntPipe,
        )
        userId: number,

        @Param(
            'propertyId',
            ParseIntPipe,
        )
        propertyId: number,
    ) {
        return this.favoritesService.checkFavorite(
            userId,
            propertyId,
        );
    }


    // ==========================================
    // REMOVE FAVORITE
    // DELETE /favorites/1/5
    // ==========================================

    @Delete(':userId/:propertyId')
    @ApiOperation({
        summary: 'Remove property from favorites',
    })
    @ApiResponse({
        status: 200,
        description: 'Favorite removed successfully',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    @ApiResponse({
        status: 404,
        description: 'Favorite not found',
    })
    remove(
        @Param(
            'userId',
            ParseIntPipe,
        )
        userId: number,

        @Param(
            'propertyId',
            ParseIntPipe,
        )
        propertyId: number,
    ) {
        return this.favoritesService.remove(
            userId,
            propertyId,
        );
    }
}