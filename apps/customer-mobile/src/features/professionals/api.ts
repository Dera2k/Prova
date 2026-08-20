import { apiRequest } from '@/api/client';
import type { Professional, ProfessionalProfile } from './types';
import type { PaginatedResponse } from '@/types/pagination';

export function getProfessionalsByCategory(
  categoryId: string,
  latitude: number,
  longitude: number,
  radiusKm: number = 5,
): Promise<PaginatedResponse<Professional>> {
  return apiRequest(
    `/services/${categoryId}/professionals?lat=${latitude}&lng=${longitude}&radius=${radiusKm}&page=1&limit=50`,
    { auth: false },
  );
}

export function getProfessional(id: string): Promise<ProfessionalProfile> {
  return apiRequest(`/professionals/${id}`, { auth: false });
}

export function getProfessionalReviews(id: string): Promise<PaginatedResponse<any>> {
  return apiRequest(`/professionals/${id}/reviews?page=1&limit=10`, { auth: false });
}