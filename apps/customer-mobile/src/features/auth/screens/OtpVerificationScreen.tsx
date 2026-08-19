import { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Screen, Button } from '@/components';
import { colors, spacing, typography, radius } from '@/theme';
import { useAuth } from '../useAuth';
import { useCountdown } from '../useCountdown';
import { ApiError } from '@/api/client';

const CODE_LENGTH = 6;
const RESEND_SECONDS = 60;

export function OtpVerificationScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const { verifyOtp, sendOtp } = useAuth();
  const { remaining, isActive, reset } = useCountdown(RESEND_SECONDS);
  const inputRef = useRef<TextInput>(null);

  const handleVerify = async (value: string) => {
    setError(undefined);
    setLoading(true);
    try {
      await verifyOtp({ phone, code: value, role: 'CUSTOMER' });
      router.replace('/tabs');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Invalid code. Try again.');
      setCode('');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, CODE_LENGTH);
    setCode(digits);
    if (digits.length === CODE_LENGTH) {
      handleVerify(digits);
    }
  };

  const handleResend = async () => {
    setError(undefined);
    try {
      await sendOtp(phone);
      reset();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not resend code.');
    }
  };

  return (
    <Screen>
      <View style={styles.content}>
        <Text style={styles.title}>Verify your number</Text>
        <Text style={styles.subtitle}>Enter the 6-digit code sent to {phone}</Text>

        <TextInput
          ref={inputRef}
          value={code}
          onChangeText={handleChange}
          keyboardType="number-pad"
          maxLength={CODE_LENGTH}
          autoFocus
          style={styles.hiddenInput}
        />

        <View style={styles.codeRow}>
          {Array.from({ length: CODE_LENGTH }).map((_, i) => (
            <View key={i} style={[styles.codeBox, error && styles.codeBoxError]}>
              <Text style={styles.codeDigit}>{code[i] ?? ''}</Text>
            </View>
          ))}
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {loading ? <Text style={styles.verifying}>Verifying…</Text> : null}

        <View style={styles.resendRow}>
          {isActive ? (
            <Text style={styles.resendMuted}>Resend code in {remaining}s</Text>
          ) : (
            <Button variant="text" onPress={handleResend}>Resend code</Button>
          )}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, justifyContent: 'center', gap: spacing.md },
  title: { ...typography.h1, color: colors.text },
  subtitle: { ...typography.body, color: colors.textMuted, marginBottom: spacing.md },
  hiddenInput: { position: 'absolute', opacity: 0, height: 1, width: 1 },
  codeRow: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.xs },
  codeBox: { flex: 1, aspectRatio: 1, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  codeBoxError: { borderColor: colors.danger },
  codeDigit: { ...typography.h2, color: colors.text },
  error: { ...typography.caption, color: colors.danger, textAlign: 'center' },
  verifying: { ...typography.caption, color: colors.textMuted, textAlign: 'center' },
  resendRow: { alignItems: 'center', marginTop: spacing.sm },
  resendMuted: { ...typography.caption, color: colors.textSubtle },
});