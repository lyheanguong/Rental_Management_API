import { Type } from 'class-transformer';
import {
    IsDateString,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';

export class CreatePaymentDto {
    @Type(() => Number)
    @IsNumber()
    contract_id!: number;

    @Type(() => Number)
    @IsNumber()
    amount!: number;

    @IsDateString()
    payment_month!: string;

    @IsString()
    payment_method!: string;

    @IsOptional()
    @IsString()
    transaction_reference?: string;

    @IsString()
    status!: string;

    @IsOptional()
    @IsString()
    invoice_number?: string;

    @Type(() => Number)
    @IsOptional()
    @IsNumber()
    tenant_id?: number;

    @Type(() => Number)
    @IsOptional()
    @IsNumber()
    property_id?: number;

    @Type(() => Number)
    @IsOptional()
    @IsNumber()
    owner_id?: number;

    @IsOptional()
    @IsDateString()
    issue_date?: string;

    @IsOptional()
    @IsDateString()
    due_date?: string;

    @Type(() => Number)
    @IsOptional()
    @IsNumber()
    rent_amount?: number;

    @Type(() => Number)
    @IsOptional()
    @IsNumber()
    electric_amount?: number;

    @Type(() => Number)
    @IsOptional()
    @IsNumber()
    water_amount?: number;

    @Type(() => Number)
    @IsOptional()
    @IsNumber()
    management_fee?: number;

    @Type(() => Number)
    @IsOptional()
    @IsNumber()
    parking_fee?: number;

    @Type(() => Number)
    @IsOptional()
    @IsNumber()
    other_charges?: number;

    @Type(() => Number)
    @IsOptional()
    @IsNumber()
    discount?: number;

    @Type(() => Number)
    @IsOptional()
    @IsNumber()
    subtotal?: number;

    @Type(() => Number)
    @IsOptional()
    @IsNumber()
    total_amount?: number;

    @IsOptional()
    @IsString()
    notes?: string;
}