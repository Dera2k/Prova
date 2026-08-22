import { apiRequest } from '@/api/client';
import type { Booking, CreateBookingPayload } from './types';
import type { PaginatedResponse } from '@/types/pagination';

export function createBooking(payload: CreateBookingPayload): Promise<Booking> {
  return apiRequest('/bookings', { method: 'POST', body: payload });
}

export function getBookings(status?: 'active' | 'completed' | 'cancelled'): Promise<PaginatedResponse<Booking>> {
  const query = status ? `?status=${status}&page=1&limit=20` : '?page=1&limit=20';
  return apiRequest(`/bookings${query}`);
}

export function getBooking(id: string): Promise<Booking> {
  return apiRequest(`/bookings/${id}`);
}

export function cancelBooking(id: string, reason: string): Promise<Booking> {
  return apiRequest(`/bookings/${id}/cancel`, { method: 'POST', body: { reason } });
}