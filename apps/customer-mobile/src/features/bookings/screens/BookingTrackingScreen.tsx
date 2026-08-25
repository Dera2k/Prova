import { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, Linking, AppState } from 'react-native';
import { Screen, Button, Card, FeedbackState } from '@/components';
import { StatusTimeline } from '@/components/StatusTimeline';
import { colors, spacing, typography } from '@/theme';
import * as bookingApi from '../api';
import type { Booking } from '../types';

const POLL_INTERVAL_MS = 15000;
const TERMINAL_STATUSES: Booking['status'][] = ['COMPLETED', 'CANCELLED', 'DISPUTED'];

interface Props {
  id: string;
}

export function BookingTrackingScreen({ id }: Props) {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchBooking = useCallback(async () => {
    try {
      const result = await bookingApi.getBooking(id);
      setBooking(result);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const startPolling = useCallback(() => {
    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      setBooking((current) => {
        if (current && TERMINAL_STATUSES.includes(current.status)) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          return current;
        }
        fetchBooking();
        return current;
      });
    }, POLL_INTERVAL_MS);
  }, [fetchBooking]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    fetchBooking();
    startPolling();

    // Stop polling while the app is backgrounded — saves battery/data,
    // resume and refetch immediately when the user comes back.
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        fetchBooking();
        startPolling();
      } else {
        stopPolling();
      }
    });

    return () => {
      stopPolling();
      subscription.remove();
    };
  }, [fetchBooking, startPolling, stopPolling]);

  if (loading) return <FeedbackState type="loading" title="Loading" message="" />;
  if (!booking) return <FeedbackState type="error" title="Not found" message="Booking not found" />;

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Card>
          <Text style={styles.service}>{booking.service.name}</Text>
          <Text style={styles.pro}>
            {booking.professional.name}
            {booking.price ? ` · ₦${booking.price.toLocaleString()} paid` : ' · Awaiting quote'}
          </Text>
        </Card>

        <View style={styles.timeline}>
          <StatusTimeline currentStatus={booking.status} history={booking.statusHistory} />
        </View>

        <Text style={styles.note}>Your payment stays with Prova until you mark the job complete.</Text>

        <View style={styles.actions}>
          <Button variant="secondary" onPress={() => Linking.openURL(`tel:${booking.professional.phone}`)}>
            Call pro
          </Button>
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