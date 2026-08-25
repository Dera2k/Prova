import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Linking, AppState } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Screen, Button, Card, FeedbackState, AppIcon } from '@/components';
import { colors, spacing, typography, radius } from '@/theme';
import * as paymentApi from '../api';
import type { Payment, PaymentType } from '../types';

const TYPE_LABEL: Record<PaymentType, string> = {
  fixed: 'Job total',
  inspection: 'Inspection fee',
  balance: 'Remaining balance',
};

export function PaymentScreen() {
  const { bookingId, type, amount } = useLocalSearchParams<{ bookingId: string; type: PaymentType; amount: string }>();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string>();

  const numericAmount = Number(amount);

  const handlePay = async () => {
    setError(undefined);
    setLoading(true);
    try {
      const result = await paymentApi.initializePayment({
        bookingId,
        amount: numericAmount,
        type,
      });
      setPayment(result);
      if (result.authorizationUrl) {
        await Linking.openURL(result.authorizationUrl);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not start payment');
    } finally {
      setLoading(false);
    }
  };

  // Paystack checkout happens in the browser/webview. When the user
  // returns to the app (backgrounded during payment, now foregrounded),
  // verify the payment rather than trusting the redirect alone.
  const handleAppStateChange = useCallback(
    async (nextState: string) => {
      if (nextState === 'active' && payment && payment.status === 'PENDING') {
        setVerifying(true);
        try {
          const verified = await paymentApi.verifyPayment(payment.id);
          setPayment(verified);
          if (verified.status === 'SUCCESS') {
            router.replace(`/booking/confirmation/${bookingId}` as never);
          }
        } catch {
          // Verification failed silently — user can retry via the button below.
        } finally {
          setVerifying(false);
        }
      }
    },
    [payment, bookingId],
  );

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [handleAppStateChange]);

  if (verifying) {
    return <FeedbackState type="loading" title="Verifying payment" message="Hold on while we confirm your payment." />;
  }

  if (payment?.status === 'FAILED') {
    return (
      <Screen>
        <FeedbackState
          type="error"
          title="Payment failed"
          message="Your payment didn't go through. No charge was made."
          actionLabel="Try again"
          onAction={() => setPayment(null)}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.iconWrap}>
        <AppIcon name="lock-closed-outline" size={28} color={colors.primary} />
      </View>
      <Text style={styles.title}>Payment</Text>

      <Card>
        <View style={styles.row}>
          <Text style={styles.label}>{TYPE_LABEL[type]}</Text>
          <Text style={styles.amount}>₦{numericAmount.toLocaleString()}</Text>
        </View>
      </Card>

      <Text style={styles.note}>
        Secured by Paystack. Prova holds your money and releases it to the professional only after you confirm the job is complete.
      </Text>

      {error && <Text style={styles.error}>{error}</Text>}

      <Button onPress={handlePay} loading={loading}>
        Pay ₦{numericAmount.toLocaleString()}
      </Button>
    </Screen>
  );
}

const styles = StyleSheet.create({
  iconWrap: { alignSelf: 'center', width: 56, height: 56, borderRadius: radius.pill, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  title: { ...typography.h1, color: colors.text, textAlign: 'center', marginBottom: spacing.lg },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { ...typography.label, color: colors.textMuted },
  amount: { ...typography.h2, color: colors.text },
  note: { ...typography.caption, color: colors.textSubtle, textAlign: 'center', marginVertical: spacing.lg },
  error: { ...typography.caption, color: colors.danger, textAlign: 'center', marginBottom: spacing.sm },
});