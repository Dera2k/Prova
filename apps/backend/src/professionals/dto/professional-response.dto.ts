import { ProfessionalVerificationStatus } from '../../common/enums/professional-status.enum';

export class ProfessionalResponseDto {
  id: string;
  userId: string;
  name: string;
  profilePhotoUrl: string | null;
  bio: string | null;
  yearsOfExperience: number;
  rating: number;
  reviewCount: number;
  verificationStatus: ProfessionalVerificationStatus;
  distance?: number;
  serviceArea: number;
  responseTimeMinutes: number | null;
}