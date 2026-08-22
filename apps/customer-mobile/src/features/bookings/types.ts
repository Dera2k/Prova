export type BookingStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'ON_THE_WAY'
  | 'ARRIVED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'DISPUTED';

export interface BookingStatusHistoryEntry {
  status: BookingStatus;
  timestamp: string;
}

export interface Booking {
  id: string;
  reference: string;
  status: BookingStatus;
  service: { id: string; name: string };
  professional: { id: string; name: string; profilePhotoUrl?: string; phone: string };
  address: { street: string; area: string; city: string };
  description: string;
  attachments: { url: string; type: 'image' | 'video' }[];
  requestedAt: string;
  scheduledFor?: string;
  notes?: string;
  price?: number;
  statusHistory: BookingStatusHistoryEntry[];
  createdAt: string;
}

export interface CreateBookingPayload {
  professionalId: string;
  serviceId: string;
  description: string;
  attachmentUrls: { url: string; type: 'image' | 'video' }[];
  addressId?: string;
  newAddress?: {
    street: string;
    area: string;
    city: string;
    state: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  scheduledFor?: string; // omit for "as soon as possible"
  notes?: string;
}

export const CANCELLABLE_STATUSES: BookingStatus[] = ['PENDING', 'ACCEPTED'];