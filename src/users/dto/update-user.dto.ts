import {
    IsEmail,
    IsIn,
    IsOptional,
    IsString,
    MinLength,
} from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    full_name?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    @MinLength(6)
    password?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    telegram_id?: string;

    @IsOptional()
    @IsString()
    avatar?: string;

    @IsOptional()
    @IsIn(['admin', 'owner', 'user'])
    role?: 'admin' | 'owner' | 'user';

    @IsOptional()
    @IsIn(['active', 'inactive'])
    status?: 'active' | 'inactive';
}