import { apiRequest } from '@/api/client';
import type { Payment, InitializePaymentPayload } from './types';

export function initializePayment(payload: InitializePaymentPayload): Promise<Payment> {
  return apiRequest('/payments/initialize', { method: 'POST', body: payload });
}

export function verifyPayment(paymentId: string): Promise<Payment> {
  return apiRequest(`/payments/${paymentId}/verify`, { method: 'POST' });
}

export function getPayment(paymentId: string): Promise<Payment> {
  return apiRequest(`/payments/${paymentId}`);
}