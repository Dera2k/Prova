import { apiRequest } from '@/api/client';
import type { Address, CreateAddressPayload } from './types';

export function getAddresses(): Promise<Address[]> {
  return apiRequest('/addresses');
}

export function createAddress(payload: CreateAddressPayload): Promise<Address> {
  return apiRequest('/addresses', { method: 'POST', body: payload });
}

export function updateAddress(id: string, payload: Partial<CreateAddressPayload>): Promise<Address> {
  return apiRequest(`/addresses/${id}`, { method: 'PATCH', body: payload });
}

export function deleteAddress(id: string): Promise<void> {
  return apiRequest(`/addresses/${id}`, { method: 'DELETE' });
}