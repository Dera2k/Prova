import { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Screen, Button, AppIcon, FeedbackState, Card } from '@/components';
import { colors, spacing, typography, radius } from '@/theme';
import * as bookingApi from '../api';
import type { Booking } from '../types';

interface Props {
  id: string;
}

export function BookingConfirmationScreen({ id }: Props) {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingApi.getBooking(id).then(setBooking).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <FeedbackState type="loading" title="Loading" message="" />;
  if (!booking) return <FeedbackState type="error" title="Not found" message="Booking not found" />;

  return (
    <Screen>
      <View style={styles.center}>
        <View style={styles.iconCircle}>
          <AppIcon name="checkmark" size={32} color={colors.background} />
        </View>
        <Text style={styles.title}>Booking confirmed</Text>
        <Text style={styles.subtitle}>
          {booking.professional.name} has been notified and is preparing to head out.
        </Text>
      </View>

      <Card>
        <Row label="Reference" value={booking.reference} />
        <Row label="Service" value={booking.service.name} />
        <Row label="Professional" value={booking.professional.name} />
        <Row label="Address" value={`${booking.address.street}, ${booking.address.area}`} />
      </Card>

      <Text style={styles.receipt}>A receipt has been sent to your phone number.</Text>

      <Button onPress={() => router.replace(`/booking/track/${id}` as never)}>Track booking</Button>
      <Button variant="text" onPress={() => router.replace('/tabs' as never)}>Back to home</Button>
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
  iconCircle: { width: 64, height: 64, borderRadius: radius.pill, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  title: { ...typography.h1, color: colors.text },
  subtitle: { ...typography.body, color: colors.textMuted, textAlign: 'center' },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs },
  rowLabel: { ...typography.caption, color: colors.textMuted },
  rowValue: { ...typography.label, color: colors.text },
  receipt: { ...typography.caption, color: colors.textSubtle, textAlign: 'center', marginVertical: spacing.lg },
});