import { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Screen, Button, Card, FeedbackState, AppIcon } from '@/components';
import { colors, spacing, typography } from '@/theme';
import * as quotationApi from '../api';

export function InspectionFeeScreen() {
  const { categoryId, bookingId } = useLocalSearchParams<{ categoryId: string; bookingId: string }>();
  const [fee, setFee] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    quotationApi.getInspectionFee(categoryId)
      .then((r) => setFee(r.amount))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load fee'))
      .finally(() => setLoading(false));
  }, [categoryId]);

  if (loading) return <FeedbackState type="loading" title="Loading" message="" />;
  if (error || fee === null) return <FeedbackState type="error" title="Error" message={error || 'Fee unavailable'} />;

  return (
    <Screen>
      <View style={styles.iconWrap}>
        <AppIcon name="build-outline" size={32} color={colors.primary} />
      </View>
      <Text style={styles.title}>This job needs an inspection</Text>
      <Text style={styles.subtitle}>
        Your professional needs to see the problem in person before pricing the full job.
      </Text>

      <Card>
        <View style={styles.row}>
          <Text style={styles.label}>Inspection fee</Text>
          <Text style={styles.amount}>₦{fee.toLocaleString()}</Text>
        </View>
      </Card>

      <Text style={styles.note}>
        This fee is non-refundable, but if you accept the professional&apos;s quote, it&apos;s credited toward your final price.
      </Text>

      <Button onPress={() => router.push(`/booking/payment/${bookingId}?type=inspection&amount=${fee}`)}>
        Pay inspection fee
      </Button>
    </Screen>
  );
}

const styles = StyleSheet.create({
  iconWrap: { alignSelf: 'center', width: 64, height: 64, borderRadius: 32, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
  title: { ...typography.h1, color: colors.text, textAlign: 'center' },
  subtitle: { ...typography.body, color: colors.textMuted, textAlign: 'center', marginTop: spacing.sm, marginBottom: spacing.lg },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { ...typography.label, color: colors.textMuted },
  amount: { ...typography.h2, color: colors.text },
  note: { ...typography.caption, color: colors.textSubtle, textAlign: 'center', marginVertical: spacing.lg },
});