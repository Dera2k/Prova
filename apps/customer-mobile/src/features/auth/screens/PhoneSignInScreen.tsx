import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import * as Google from 'expo-auth-session/providers/google';
import { Screen, Button, AppTextInput } from '@/components';
import { colors, spacing, typography } from '@/theme';
import { useAuth } from '../useAuth';
import { ApiError } from '@/api/client';

const GOOGLE_ANDROID_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;

export function PhoneSignInScreen() {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const { sendOtp, signInWithGoogle } = useAuth();

  // useAuthRequest must always run — pass an empty client ID rather than
  // skip the hook. Rules of Hooks forbids conditional hook calls. The
  // button itself is hidden below when there's no real client ID, so
  // promptGoogle never actually gets invoked in that state.
  const [, googleResponse, promptGoogle] = Google.useAuthRequest({
    androidClientId: GOOGLE_ANDROID_CLIENT_ID ?? '',
  });

  const handleSendCode = async () => {
    setError(undefined);
    if (phone.trim().length < 10) {
      setError('Enter a valid Nigerian phone number');
      return;
    }
    setLoading(true);
    try {
      const fullPhone = phone.startsWith('+') ? phone : `+234${phone.replace(/^0/, '')}`;
      await sendOtp(fullPhone);
      router.push({ pathname: '/auth/verify-otp', params: { phone: fullPhone } });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not send code. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    if (!GOOGLE_ANDROID_CLIENT_ID) return;
    setError(undefined);
    const result = await promptGoogle();
    if (result?.type === 'success' && result.authentication?.idToken) {
      setLoading(true);
      try {
        await signInWithGoogle({ idToken: result.authentication.idToken, role: 'CUSTOMER' });
      } catch (err) {
        setError(err instanceof ApiError ? err.message : 'Google sign-in failed');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Screen>
      <View style={styles.content}>
        <Text style={styles.title}>Sign in</Text>
        <Text style={styles.subtitle}>We&apos;ll send a 6-digit code to confirm it&apos;s you.</Text>

        <AppTextInput
          label="Phone number"
          keyboardType="phone-pad"
          placeholder="801 234 5678"
          value={phone}
          onChangeText={setPhone}
          error={error}
        />

        <Button onPress={handleSendCode} loading={loading}>Send code</Button>

        {GOOGLE_ANDROID_CLIENT_ID && (
          <>
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <Button variant="secondary" onPress={handleGoogle} disabled={!googleResponse && loading}>
              Continue with Google
            </Button>
          </>
        )}

        <Text style={styles.terms}>
          By continuing you agree to Prova&apos;s Terms and Privacy Policy.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, justifyContent: 'center', gap: spacing.md },
  title: { ...typography.h1, color: colors.text },
  subtitle: { ...typography.body, color: colors.textMuted, marginBottom: spacing.sm },
  divider: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginVertical: spacing.xs },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { ...typography.caption, color: colors.textSubtle },
  terms: { ...typography.caption, color: colors.textSubtle, textAlign: 'center', marginTop: spacing.md },
});