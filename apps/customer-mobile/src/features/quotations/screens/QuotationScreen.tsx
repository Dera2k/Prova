import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { Screen, Button, Card, FeedbackState } from '@/components';
import { colors, spacing, typography } from '@/theme';
import * as quotationApi from '../api';
import type { Quotation } from '../types';

interface Props {
  bookingId: string;
}

const POLL_INTERVAL_MS = 15000;

export function QuotationScreen({ bookingId }: Props) {
  const [quotation, setQuotation] = useState<Quotation | null>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);

  const fetchQuotation = useCallback(async () => {
    try {
      const result = await quotationApi.getQuotation(bookingId);
      setQuotation(result);
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    fetchQuotation();
    // Poll while awaiting a quote — the pro hasn't submitted one yet.
    const interval = setInterval(() => {
      if (!quotation || quotation.status === 'PENDING') fetchQuotation();
    }, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchQuotation, quotation]);

  const handleAccept = async () => {
    if (!quotation) return;
    setActing(true);
    try {
      await quotationApi.acceptQuotation(quotation.id);
      router.replace(`/booking/payment/${bookingId}?type=balance&amount=${quotation.total - quotation.inspectionFee}`);
    } finally {
      setActing(false);
    }
  };

  const handleReject = () => {
    if (!quotation) return;
    Alert.alert('Reject quote', 'Your inspection fee will not be refunded. Continue?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reject',
        style: 'destructive',
        onPress: async () => {
          setActing(true);
          try {
            await quotationApi.rejectQuotation(quotation.id);
            router.replace(`/booking/${bookingId}`);
          } finally {
            setActing(false);
          }
        },
      },
    ]);
  };

  if (loading) return <FeedbackState type="loading" title="Loading" message="" />;

  if (!quotation || quotation.status === 'PENDING') {
    return (
      <Screen>
        <FeedbackState
          type="loading"
          title="Waiting for quote"
          message="Your professional is preparing a quote based on the inspection."
        />
      </Screen>
    );
  }

  if (quotation.status === 'EXPIRED') {
    return (
      <Screen>
        <FeedbackState
          type="error"
          title="Quote expired"
          message="This quote is no longer valid. Contact support or start a new booking."
          actionLabel="Back to bookings"
          onAction={() => router.replace('/tabs/bookings')}
        />
      </Screen>
    );
  }

  if (quotation.status === 'REJECTED' || quotation.status === 'CANCELLED') {
    return (
      <Screen>
        <FeedbackState
          type="empty"
          title="Quote declined"
          message="You rejected this quote. Your inspection fee is non-refundable."
          actionLabel="Back to bookings"
          onAction={() => router.replace('/tabs/bookings')}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Quotation</Text>
        <Text style={styles.subtitle}>Ref {quotation.id.slice(0, 8)}</Text>

        <Card>
          <Text style={styles.breakdownLabel}>BREAKDOWN</Text>
          <Row label="Labour" amount={quotation.labourCost} />
          <Row label="Materials" amount={quotation.materialsCost} />
          <Row label="Inspection fee (already paid)" amount={quotation.inspectionFee} />
          <Row label="Service fee" amount={quotation.serviceFee} />
          <View style={styles.divider} />
          <Row label="Total" amount={quotation.total} bold />
        </Card>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            The ₦{quotation.inspectionFee.toLocaleString()} inspection fee you already paid is included above — you are not charged twice. If you reject this quote, only the inspection fee is kept.
          </Text>
        </View>

        <Text style={styles.note}>
          Payment is held by Prova and released to the professional only after you confirm the job is done.
        </Text>

        {quotation.status === 'SENT' && (
          <View style={styles.actions}>
            <Button variant="secondary" onPress={handleReject} loading={acting}>Reject</Button>
            <Button onPress={handleAccept} loading={acting}>
              Accept ₦{quotation.total.toLocaleString()}
            </Button>
          </View>
        )}

        {quotation.status === 'ACCEPTED' && (
          <FeedbackState type="empty" title="Quote accepted" message="Proceed to payment to confirm this job." />
        )}
      </ScrollView>
    </Screen>
  );
}

function Row({ label, amount, bold }: { label: string; amount: number; bold?: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, bold && styles.rowLabelBold]}>{label}</Text>
      <Text style={[styles.rowAmount, bold && styles.rowAmountBold]}>₦{amount.toLocaleString()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.h1, color: colors.text },
  subtitle: { ...typography.caption, color: colors.textMuted, marginBottom: spacing.lg },
  breakdownLabel: { ...typography.caption, color: colors.textSubtle, marginBottom: spacing.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs },
  rowLabel: { ...typography.body, color: colors.textMuted },
  rowLabelBold: { ...typography.label, color: colors.text },
  rowAmount: { ...typography.body, color: colors.text },
  rowAmountBold: { ...typography.h3, color: colors.text },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.xs },
  infoBox: { backgroundColor: colors.primarySoft, borderRadius: 12, padding: spacing.md, marginVertical: spacing.md },
  infoText: { ...typography.caption, color: colors.primary },
  note: { ...typography.caption, color: colors.textSubtle, textAlign: 'center', marginBottom: spacing.lg },
  actions: { flexDirection: 'row', gap: spacing.sm },
});