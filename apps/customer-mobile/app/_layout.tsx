import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { AuthProvider } from '@/features/auth/AuthContext';
import { useAuth } from '@/features/auth/useAuth';
import { Screen, FeedbackState } from '@/components';

function RouteGuard({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (status === 'restoring') return;
    const inAuthGroup = segments[0] === 'auth';

    if (status === 'unauthenticated' && !inAuthGroup) {
      router.replace('/auth');
    } else if (status === 'authenticated' && inAuthGroup) {
      router.replace('/tabs');
    }
  }, [status, segments, router]);

  if (status === 'restoring') {
    return (
      <Screen>
        <FeedbackState type="loading" title="Loading" message="" />
      </Screen>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RouteGuard>
        <Stack screenOptions={{ headerShown: false }} />
      </RouteGuard>
    </AuthProvider>
  );
}