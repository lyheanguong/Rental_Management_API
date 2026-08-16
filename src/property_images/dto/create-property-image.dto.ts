import {
    IsBoolean,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';

export class CreatePropertyImageDto {
    @IsOptional()
    @IsNumber()
    property_id?: number;

    @IsOptional()
    @IsString()
    image_url?: string;

    @IsOptional()
    @IsBoolean()
    is_cover?: boolean = false;
}