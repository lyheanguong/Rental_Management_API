import {
    IsString,
    IsNumber,
    IsOptional,
    IsEnum,
    IsLatitude,
    IsLongitude,
    Min,
    MaxLength,
} from 'class-validator';

import { Type } from 'class-transformer';

export class UpdatePropertyDto {
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    owner_id?: number;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    property_type?: string;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsString()
    city?: string;

    @IsOptional()
    @IsString()
    province?: string;

    @IsOptional()
    @IsString()
    country?: string;

    @IsOptional()
    @Type(() => Number)
    @IsLatitude()
    latitude?: number;

    @IsOptional()
    @Type(() => Number)
    @IsLongitude()
    longitude?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    price?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    bedrooms?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    bathrooms?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    area?: number;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    image?: string;

    @IsOptional()
    @IsString()
    @MaxLength(50)
    property_code?: string;

    @IsOptional()
    @IsEnum([
        'available',
        'sold',
        'rented',
        'pending',
    ])
    availability_status?: string;
}