import { apiRequest } from '@/api/client';
import type { Category, Service, CategoryFee } from './types';
import type { PaginatedResponse } from '@/types/pagination';

export function getCategories(): Promise<Category[]> {
  return apiRequest('/categories', { auth: false });
}

export function getServices(categoryId: string): Promise<Service[]> {
  return apiRequest(`/categories/${categoryId}/services`, { auth: false });
}

export function getCategoryFee(categoryId: string): Promise<CategoryFee> {
  return apiRequest(`/categories/${categoryId}/fee`, { auth: false });
}