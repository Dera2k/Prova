import { IsEnum, IsUrl } from 'class-validator';
import { KycDocumentType } from '../../common/enums/kyc-status.enum';

export class SubmitKycDto {
  @IsEnum(KycDocumentType)
  type: KycDocumentType;

  @IsUrl()
  fileUrl: string;
}