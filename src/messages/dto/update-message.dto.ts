import {
    IsBoolean,
    IsNotEmpty,
    IsOptional,
    IsString,
} from 'class-validator';

export class UpdateMessageDto {

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    message?: string;

    @IsOptional()
    @IsBoolean()
    is_read?: boolean;
}