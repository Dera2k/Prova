import { apiRequest } from '@/api/client';
import type { AuthTokens, GoogleAuthPayload, SendOtpPayload, User, VerifyOtpPayload } from './types';

export function sendOtp(payload: SendOtpPayload): Promise<{ success: boolean; message: string }> {
  return apiRequest('/auth/send-otp', { method: 'POST', body: payload, auth: false });
}

export function verifyOtp(payload: VerifyOtpPayload): Promise<AuthTokens> {
  return apiRequest('/auth/verify-otp', { method: 'POST', body: payload, auth: false });
}

export function authenticateWithGoogle(payload: GoogleAuthPayload): Promise<AuthTokens> {
  return apiRequest('/auth/google', { method: 'POST', body: payload, auth: false });
}

export function logout(refreshToken: string): Promise<{ success: boolean }> {
  return apiRequest('/auth/logout', { method: 'POST', body: { refreshToken } });
}

export function getMe(): Promise<User> {
  return apiRequest('/users/me', { method: 'GET' });
}