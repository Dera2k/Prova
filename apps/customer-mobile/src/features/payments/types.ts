export type PaymentType = 'fixed' | 'inspection' | 'balance';
export type PaymentStatus = 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  type: PaymentType;
  status: PaymentStatus;
  paystackReference: string;
  authorizationUrl?: string;
  createdAt: string;
}

export interface InitializePaymentPayload {
  bookingId: string;
  amount: number;
  type: PaymentType;
}