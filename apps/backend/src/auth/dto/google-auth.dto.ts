import { IsString, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from '../../common/enums/user-role.enum';

export class GoogleAuthDto {
  @IsString()
  idToken: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}