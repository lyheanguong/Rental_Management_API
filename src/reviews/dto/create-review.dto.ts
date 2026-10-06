import {
    IsInt,
    IsNotEmpty,
    IsString,
    Max,
    Min,
} from 'class-validator';

export class CreateReviewDto {
    @IsInt()
    property_id!: number;

    @IsString()
    username!: string;

    @IsInt()
    user_id!: number;

    @IsInt()
    @Min(1)
    @Max(5)
    rating!: number;

    @IsString()
    @IsNotEmpty()
    title!: string;

    @IsString()
    @IsNotEmpty()
    comment!: string;
}