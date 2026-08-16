import {
    IsDateString,
    IsInt,
    IsNotEmpty,
    IsString,
} from 'class-validator';

export class CreateRentalRequestDto {
    @IsInt()
    property_id!: number;

    @IsInt()
    tenant_id!: number;

    @IsDateString()
    start_date!: Date;

    @IsDateString()
    end_date!: Date;

    @IsString()
    @IsNotEmpty()
    message!: string;

    @IsString()
    status!: string;
}