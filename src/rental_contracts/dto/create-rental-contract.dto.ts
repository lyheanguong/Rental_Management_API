import {
    IsDateString,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';

export class CreateRentalContractDto {
    @IsOptional()
    @IsNumber()
    request_id?: number;

    @IsNumber()
    property_id!: number;

    @IsNumber()
    tenant_id!: number;

    @IsNumber()
    owner_id!: number;

    @IsDateString()
    start_date!: Date;

    @IsDateString()
    end_date!: Date;

    @IsNumber()
    monthly_price!: number;

    @IsNumber()
    deposit_amount!: number;

    @IsString()
    @IsNotEmpty()
    status!: string;
}