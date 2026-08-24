export type QuotationStatus = 'PENDING' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED' | 'CANCELLED';

export interface QuotationLineItem {
  label: string;
  amount: number;
}

export interface Quotation {
  id: string;
  bookingId: string;
  status: QuotationStatus;
  labourCost: number;
  materialsCost: number;
  inspectionFee: number;
  serviceFee: number;
  total: number;
  notes?: string;
  expiresAt: string;
  createdAt: string;
}

export interface InspectionFeeInfo {
  categoryId: string;
  amount: number;
}