export type UserRole = 'CUSTOMER' | 'PROFESSIONAL' | 'ADMIN' | 'SUPER_ADMIN';

export interface User {
  id: string;
  phone: string | null;
  email: string | null;
  fullName: string | null;
  profilePhotoUrl: string | null;
  role: UserRole;
  phoneVerified: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface SendOtpPayload {
  phone: string;
}

export interface VerifyOtpPayload {
  phone: string;
  code: string;
  role?: UserRole;
  fullName?: string;
}

export interface GoogleAuthPayload {
  idToken: string;
  role?: UserRole;
}

export type AuthStatus = 'restoring' | 'authenticated' | 'unauthenticated';