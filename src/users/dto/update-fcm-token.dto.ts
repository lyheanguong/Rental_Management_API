import {
    IsNotEmpty,
    IsString,
} from 'class-validator';

export class UpdateFcmTokenDto {
    @IsString()
    @IsNotEmpty()
    fcm_token!: string;
}