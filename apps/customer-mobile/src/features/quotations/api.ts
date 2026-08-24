import { apiRequest } from '@/api/client';
import type { Quotation, InspectionFeeInfo } from './types';

export function getQuotation(bookingId: string): Promise<Quotation | null> {
  return apiRequest(`/bookings/${bookingId}/quotation`);
}

export function getInspectionFee(categoryId: string): Promise<InspectionFeeInfo> {
  return apiRequest(`/categories/${categoryId}/fee`, { auth: false });
}

export function acceptQuotation(quotationId: string): Promise<Quotation> {
  return apiRequest(`/quotations/${quotationId}/accept`, { method: 'POST' });
}

export function rejectQuotation(quotationId: string): Promise<Quotation> {
  return apiRequest(`/quotations/${quotationId}/reject`, { method: 'POST' });
}