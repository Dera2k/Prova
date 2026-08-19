import { createContext, useEffect, useState, useCallback, type PropsWithChildren } from 'react';
import * as authApi from './api';
import * as tokenStorage from './tokenStorage';
import { setOnRefreshFailure } from '@/api/client';
import type { AuthStatus, User, VerifyOtpPayload, GoogleAuthPayload } from './types';

interface AuthContextValue {
  status: AuthStatus;
  user: User | null;
  sendOtp: (phone: string) => Promise<void>;
  verifyOtp: (payload: VerifyOtpPayload) => Promise<void>;
  signInWithGoogle: (payload: GoogleAuthPayload) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [status, setStatus] = useState<AuthStatus>('restoring');
  const [user, setUser] = useState<User | null>(null);

  const handleAuthSuccess = useCallback(async () => {
    const me = await authApi.getMe();
    setUser(me);
    setStatus('authenticated');
  }, []);

  useEffect(() => {
    setOnRefreshFailure(() => {
      setUser(null);
      setStatus('unauthenticated');
    });
  }, []);

  useEffect(() => {
    (async () => {
      const accessToken = await tokenStorage.getAccessToken();
      if (!accessToken) {
        setStatus('unauthenticated');
        return;
      }
      try {
        await handleAuthSuccess();
      } catch {
        await tokenStorage.clearTokens();
        setStatus('unauthenticated');
      }
    })();
  }, [handleAuthSuccess]);

  const sendOtp = useCallback(async (phone: string) => {
    await authApi.sendOtp({ phone });
  }, []);

  const verifyOtp = useCallback(async (payload: VerifyOtpPayload) => {
    const tokens = await authApi.verifyOtp(payload);
    await tokenStorage.setTokens(tokens.accessToken, tokens.refreshToken);
    await handleAuthSuccess();
  }, [handleAuthSuccess]);

  const signInWithGoogle = useCallback(async (payload: GoogleAuthPayload) => {
    const tokens = await authApi.authenticateWithGoogle(payload);
    await tokenStorage.setTokens(tokens.accessToken, tokens.refreshToken);
    await handleAuthSuccess();
  }, [handleAuthSuccess]);

  const logout = useCallback(async () => {
    const refreshToken = await tokenStorage.getRefreshToken();
    if (refreshToken) {
      await authApi.logout(refreshToken).catch(() => {});
    }
    await tokenStorage.clearTokens();
    setUser(null);
    setStatus('unauthenticated');
  }, []);

  return (
    <AuthContext.Provider value={{ status, user, sendOtp, verifyOtp, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}