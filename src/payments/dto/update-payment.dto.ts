import {
    IsDateString,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';

export class UpdatePaymentDto {
    @IsOptional()
    @IsNumber()
    contract_id?: number;

    @IsOptional()
    @IsNumber()
    amount?: number;

    @IsOptional()
    @IsDateString()
    payment_month?: Date;

    @IsOptional()
    @IsString()
    payment_method?: string;

    @IsOptional()
    @IsString()
    transaction_reference?: string;

    @IsOptional()
    @IsString()
    status?: string;

    @IsOptional()
    @IsString()
    invoice_number?: string;

    @IsOptional()
    @IsNumber()
    tenant_id?: number;

    @IsOptional()
    @IsNumber()
    property_id?: number;

    @IsOptional()
    @IsNumber()
    owner_id?: number;

    @IsOptional()
    @IsDateString()
    issue_date?: Date;

    @IsOptional()
    @IsDateString()
    due_date?: Date;

    @IsOptional()
    @IsNumber()
    rent_amount?: number;

    @IsOptional()
    @IsNumber()
    electric_amount?: number;

    @IsOptional()
    @IsNumber()
    water_amount?: number;

    @IsOptional()
    @IsNumber()
    management_fee?: number;

    @IsOptional()
    @IsNumber()
    parking_fee?: number;

    @IsOptional()
    @IsNumber()
    other_charges?: number;

    @IsOptional()
    @IsNumber()
    discount?: number;

    @IsOptional()
    @IsNumber()
    subtotal?: number;

    @IsOptional()
    @IsNumber()
    total_amount?: number;

    @IsOptional()
    @IsString()
    notes?: string;
}