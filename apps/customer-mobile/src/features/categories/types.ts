export interface Category {
  id: string;
  name: string;
  icon?: string;
}

export interface Service {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  pricingModel: 'FIXED' | 'STARTING_FROM' | 'QUOTE_REQUIRED' | 'HOURLY';
  startingPrice?: number;
}

export interface CategoryFee {
  categoryId: string;
  inspectionFee: number;
}