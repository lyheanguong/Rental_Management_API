import { IsBoolean, IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsString()
    full_name!: string;

    @IsEmail()
    email!: string;

    @IsString()
    @MinLength(6)
    password!: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    avatar?: string;

    @IsString()
    role!: string;

    @IsOptional()
    @IsString()
    telegram_id!: string;

    @IsBoolean()
    status!: boolean;
}