import {
    IsDateString,
    IsNotEmpty,
    IsNumber,
    IsString,
} from 'class-validator';

export class CreateRentalContractDto {
    @IsNumber()
    request_id!: number;

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