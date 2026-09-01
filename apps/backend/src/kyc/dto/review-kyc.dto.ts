import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ProfessionalVerificationStatus } from '../../common/enums/professional-status.enum';

export class ReviewKycDto {
  @IsEnum(ProfessionalVerificationStatus)
  status: ProfessionalVerificationStatus.VERIFIED | ProfessionalVerificationStatus.REJECTED;

  @IsOptional()
  @IsString()
  rejectionReason?: string;
}