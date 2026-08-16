import {
    IsDateString,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';

export class UpdateRentalContractDto {
    @IsOptional()
    @IsNumber()
    request_id?: number;

    @IsOptional()
    @IsNumber()
    property_id?: number;

    @IsOptional()
    @IsNumber()
    tenant_id?: number;

    @IsOptional()
    @IsNumber()
    owner_id?: number;

    @IsOptional()
    @IsDateString()
    start_date?: Date;

    @IsOptional()
    @IsDateString()
    end_date?: Date;

    @IsOptional()
    @IsNumber()
    monthly_price?: number;

    @IsOptional()
    @IsNumber()
    deposit_amount?: number;

    @IsOptional()
    @IsString()
    status?: string;
}