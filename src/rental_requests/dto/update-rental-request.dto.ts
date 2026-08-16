import {
    IsDateString,
    IsIn,
    IsInt,
    IsOptional,
    IsString,
} from 'class-validator';

export class UpdateRentalRequestDto {
    @IsOptional()
    @IsInt()
    property_id?: number;

    @IsOptional()
    @IsInt()
    tenant_id?: number;

    @IsOptional()
    @IsDateString()
    start_date?: Date;

    @IsOptional()
    @IsDateString()
    end_date?: Date;

    @IsOptional()
    @IsString()
    message?: string;

    @IsOptional()
    @IsIn([
        'PENDING',
        'APPROVED',
        'REJECTED',
        'CANCELLED',
    ])
    status?: string;
}