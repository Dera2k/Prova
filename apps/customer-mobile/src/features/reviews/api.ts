import { apiRequest } from '@/api/client';
import type { Review, SubmitReviewPayload } from './types';
import type { PaginatedResponse } from '@/types/pagination';

export function submitReview(bookingId: string, payload: SubmitReviewPayload): Promise<Review> {
  return apiRequest(`/bookings/${bookingId}/review`, { method: 'POST', body: payload });
}

export function getProfessionalReviews(professionalId: string): Promise<PaginatedResponse<Review>> {
  return apiRequest(`/professionals/${professionalId}/reviews?page=1&limit=10`, { auth: false });
}