export interface Address {
  id: string;
  label: string;
  street: string;
  area: string;
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  instructions?: string;
  isDefault: boolean;
}

export interface CreateAddressPayload {
  label: string;
  street: string;
  area: string;
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  instructions?: string;
}