import {
    IsInt,
} from 'class-validator';

export class CreateFavoriteDto {
    @IsInt()
    user_id?: number;

    @IsInt()
    property_id?: number;
}