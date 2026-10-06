import {
    IsInt,
    IsOptional,
    IsString,
    Max,
    Min,
} from 'class-validator';

export class UpdateReviewDto {
    @IsOptional()
    @IsInt()
    property_id?: number;

    @IsOptional()
    @IsInt()
    user_id?: number;

    @IsOptional()
    @IsString()
    username?: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(5)
    rating?: number;

    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    comment?: string;
}