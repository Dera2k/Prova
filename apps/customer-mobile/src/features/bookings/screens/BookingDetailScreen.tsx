import { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { Screen, Button, Card, FeedbackState } from '@/components';
import { StatusTimeline } from '@/components/StatusTimeline';
import { colors, spacing, typography } from '@/theme';
import * as bookingApi from '../api';
import { CANCELLABLE_STATUSES } from '../types';
import type { Booking } from '../types';

interface Props {
  id: string;
}

export function BookingDetailScreen({ id }: Props) {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    bookingApi.getBooking(id).then(setBooking).finally(() => setLoading(false));
  }, [id]);

  const handleCancel = () => {
    Alert.alert('Cancel booking', 'Are you sure you want to cancel this booking?', [
      { text: 'Keep booking', style: 'cancel' },
      {
        text: 'Cancel booking',
        style: 'destructive',
        onPress: async () => {
          setCancelling(true);
          try {
            const updated = await bookingApi.cancelBooking(id, 'Customer requested cancellation');
            setBooking(updated);
          } finally {
            setCancelling(false);
          }
        },
      },
    ]);
  };

  if (loading) return <FeedbackState type="loading" title="Loading" message="" />;
  if (!booking) return <FeedbackState type="error" title="Not found" message="Booking not found" />;

  const canCancel = CANCELLABLE_STATUSES.includes(booking.status);

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{booking.service.name}</Text>
        <Text style={styles.reference}>{booking.reference}</Text>

        <View style={styles.timeline}>
          <StatusTimeline currentStatus={booking.status} history={booking.statusHistory} />
        </View>

        <Card>
          <Text style={styles.sectionTitle}>Details</Text>
          <Text style={styles.description}>{booking.description}</Text>
          {booking.notes && <Text style={styles.notes}>Note: {booking.notes}</Text>}
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Address</Text>
          <Text style={styles.description}>{booking.address.street}, {booking.address.area}, {booking.address.city}</Text>
        </Card>

        {booking.price && (
          <Card>
            <Text style={styles.sectionTitle}>Payment</Text>
            <Text style={styles.price}>₦{booking.price.toLocaleString()}</Text>
          </Card>
        )}

        {canCancel && (
          <Button variant="danger" onPress={handleCancel} loading={cancelling}>
            Cancel booking
          </Button>
        )}

        {booking.status === 'COMPLETED' && (
          <Button onPress={() => router.push(`/booking/review/${id}` as never)}>Rate this job</Button>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.h1, color: colors.text },
  reference: { ...typography.caption, color: colors.textMuted, marginBottom: spacing.lg },
  timeline: { marginBottom: spacing.lg },
  sectionTitle: { ...typography.label, color: colors.text, marginBottom: spacing.xs },
  description: { ...typography.body, color: colors.textMuted },
  notes: { ...typography.caption, color: colors.textSubtle, marginTop: spacing.xs },
  price: { ...typography.h2, color: colors.primary },
});