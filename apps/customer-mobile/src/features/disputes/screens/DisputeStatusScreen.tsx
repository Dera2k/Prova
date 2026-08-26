import { useState, useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import { Screen, Card, FeedbackState, Badge } from '@/components';
import { colors, spacing, typography } from '@/theme';
import * as disputeApi from '../api';
import type { Dispute, DisputeStatus } from '../types';

interface Props {
  bookingId: string;
}

const STATUS_TONE: Record<DisputeStatus, 'warning' | 'success' | 'danger' | 'neutral'> = {
  OPEN: 'warning',
  UNDER_REVIEW: 'warning',
  RESOLVED: 'success',
  REJECTED: 'danger',
  ESCALATED: 'danger',
};

export function DisputeStatusScreen({ bookingId }: Props) {
  const [dispute, setDispute] = useState<Dispute | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    disputeApi.getDispute(bookingId).then(setDispute).finally(() => setLoading(false));
  }, [bookingId]);

  if (loading) return <FeedbackState type="loading" title="Loading" message="" />;
  if (!dispute) return <FeedbackState type="empty" title="No dispute" message="No dispute has been filed for this booking." />;

  return (
    <Screen>
      <Text style={styles.title}>Dispute status</Text>
      <Badge label={dispute.status.replace('_', ' ')} tone={STATUS_TONE[dispute.status]} />

      <Card>
        <Text style={styles.label}>Reason</Text>
        <Text style={styles.value}>{dispute.reason}</Text>
        <Text style={[styles.label, styles.spaced]}>Description</Text>
        <Text style={styles.value}>{dispute.description}</Text>
        {dispute.resolution && (
          <>
            <Text style={[styles.label, styles.spaced]}>Resolution</Text>
            <Text style={styles.value}>{dispute.resolution}</Text>
          </>
        )}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.h1, color: colors.text, marginBottom: spacing.sm },
  label: { ...typography.caption, color: colors.textMuted },
  value: { ...typography.body, color: colors.text, marginTop: spacing.xxs },
  spaced: { marginTop: spacing.md },
});