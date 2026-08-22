import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, Linking } from 'react-native';
import { Screen, Button, Card, FeedbackState } from '@/components';
import { StatusTimeline } from '@/components/StatusTimeline';
import { colors, spacing, typography } from '@/theme';
import * as bookingApi from '../api';
import type { Booking } from '../types';

const POLL_INTERVAL_MS = 15000;

interface Props {
  id: string;
}

export function BookingTrackingScreen({ id }: Props) {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBooking = useCallback(async () => {
    try {
      const result = await bookingApi.getBooking(id);
      setBooking(result);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBooking();
    const interval = setInterval(fetchBooking, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchBooking]);

  if (loading) return <FeedbackState type="loading" title="Loading" message="" />;
  if (!booking) return <FeedbackState type="error" title="Not found" message="Booking not found" />;

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Card>
          <Text style={styles.service}>{booking.service.name}</Text>
          <Text style={styles.pro}>{booking.professional.name} · {booking.price ? `₦${booking.price.toLocaleString()} paid` : 'Awaiting quote'}</Text>
        </Card>

        <View style={styles.timeline}>
          <StatusTimeline currentStatus={booking.status} history={booking.statusHistory} />
        </View>

        <Text style={styles.note}>Your payment stays with Prova until you mark the job complete.</Text>

        <View style={styles.actions}>
          <Button variant="secondary" onPress={() => Linking.openURL(`tel:${booking.professional.phone}`)}>
            Call pro
          </Button>
          {booking.status === 'IN_PROGRESS' && (
            <Button onPress={() => {/* handled in Booking Tracking + Confirmation phase */}}>
              Mark complete
            </Button>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  service: { ...typography.label, color: colors.text },
  pro: { ...typography.caption, color: colors.textMuted, marginTop: spacing.xxs },
  timeline: { marginVertical: spacing.lg },
  note: { ...typography.caption, color: colors.textMuted, textAlign: 'center', marginBottom: spacing.lg },
  actions: { flexDirection: 'row', gap: spacing.sm },
});