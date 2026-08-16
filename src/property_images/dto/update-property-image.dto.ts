import {
    IsBoolean,
    IsOptional,
    IsString,
} from 'class-validator';


export class UpdatePropertyImageDto {

    @IsOptional()
    @IsString()
    image_url?: string;


    @IsOptional()
    @IsBoolean()
    is_cover?: boolean;

}