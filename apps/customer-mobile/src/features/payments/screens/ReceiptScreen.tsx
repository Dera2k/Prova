import { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Screen, Button, Card, FeedbackState, AppIcon } from '@/components';
import { colors, spacing, typography, radius } from '@/theme';
import * as paymentApi from '../api';
import type { Payment } from '../types';

interface Props {
  paymentId: string;
}

export function ReceiptScreen({ paymentId }: Props) {
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    paymentApi.getPayment(paymentId).then(setPayment).finally(() => setLoading(false));
  }, [paymentId]);

  if (loading) return <FeedbackState type="loading" title="Loading" message="" />;
  if (!payment) return <FeedbackState type="error" title="Not found" message="Receipt not found" />;

  const isSuccess = payment.status === 'SUCCESS';

  return (
    <Screen>
      <View style={styles.center}>
        <View style={[styles.iconCircle, !isSuccess && styles.iconCircleDanger]}>
          <AppIcon name={isSuccess ? 'checkmark' : 'close'} size={28} color={colors.background} />
        </View>
        <Text style={styles.title}>{isSuccess ? 'Payment successful' : 'Payment failed'}</Text>
      </View>

      <Card>
        <Row label="Amount" value={`₦${payment.amount.toLocaleString()}`} />
        <Row label="Reference" value={payment.paystackReference} />
        <Row label="Status" value={payment.status} />
        <Row label="Date" value={new Date(payment.createdAt).toLocaleDateString()} />
      </Card>

      <Button onPress={() => router.replace(`/booking/${payment.bookingId}` as never)}>
        View booking
      </Button>
    </Screen>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', gap: spacing.sm, marginVertical: spacing.xl },
  iconCircle: { width: 56, height: 56, borderRadius: radius.pill, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  iconCircleDanger: { backgroundColor: colors.danger },
  title: { ...typography.h2, color: colors.text },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs },
  rowLabel: { ...typography.caption, color: colors.textMuted },
  rowValue: { ...typography.label, color: colors.text },
});