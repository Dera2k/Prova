export type VerificationStatus = 'PENDING' | 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED' | 'SUSPENDED';

export interface Professional {
  id: string;
  userId: string;
  name: string;
  profilePhotoUrl?: string;
  bio?: string;
  yearsOfExperience: number;
  rating: number;
  reviewCount: number;
  verificationStatus: VerificationStatus;
  verificationBadge: boolean;
  distance?: number;
  serviceArea: { latitude: number; longitude: number; radiusKm: number };
  services: { id: string; name: string }[];
  responseTimeMinutes?: number;
}

export interface ProfessionalProfile extends Professional {
  recentReviews: { author: string; rating: number; text: string; date: string }[];
}