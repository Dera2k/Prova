import { apiRequest } from '@/api/client';
import type { Dispute, SubmitDisputePayload } from './types';

export function submitDispute(bookingId: string, payload: SubmitDisputePayload): Promise<Dispute> {
  return apiRequest(`/bookings/${bookingId}/dispute`, { method: 'POST', body: payload });
}

export function getDispute(bookingId: string): Promise<Dispute | null> {
  return apiRequest(`/bookings/${bookingId}/dispute`);
}