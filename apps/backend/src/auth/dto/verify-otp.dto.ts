import { IsPhoneNumber, Length, IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../../common/enums/user-role.enum';

export class VerifyOtpDto {
  @IsPhoneNumber('NG')
  phone: string;

  @Length(6, 6)
  code: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsString()
  fullName?: string;
}