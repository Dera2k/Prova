import { useState, useEffect } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Screen, Badge, FeedbackState } from '@/components';
import { colors, spacing, typography, radius } from '@/theme';
import * as bookingApi from '../api';
import type { Booking, BookingStatus } from '../types';

type Tab = 'active' | 'completed' | 'cancelled';

const STATUS_TONE: Partial<Record<BookingStatus, 'success' | 'warning' | 'danger' | 'neutral'>> = {
  PENDING: 'warning',
  ACCEPTED: 'warning',
  ON_THE_WAY: 'warning',
  ARRIVED: 'warning',
  IN_PROGRESS: 'warning',
  COMPLETED: 'success',
  CANCELLED: 'danger',
  DISPUTED: 'danger',
};

export function BookingHistoryScreen() {
  const [tab, setTab] = useState<Tab>('active');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    bookingApi.getBookings(tab).then((r) => setBookings(r.data)).finally(() => setLoading(false));
  }, [tab]);

  return (
    <Screen>
      <View style={styles.tabs}>
        {(['active', 'completed', 'cancelled'] as Tab[]).map((t) => (
          <Pressable key={t} onPress={() => setTab(t)} style={[styles.tab, tab === t && styles.tabActive]}>
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t[0].toUpperCase() + t.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>

      {loading ? (
        <FeedbackState type="loading" title="Loading" message="" />
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(b) => b.id}
          ListEmptyComponent={<FeedbackState type="empty" title="No bookings" message="Your bookings will appear here." />}
          renderItem={({ item }) => (
            <Pressable onPress={() => router.push(`/booking/${item.id}` as never)}>
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{item.service.name}</Text>
                  <Text style={styles.cardPrice}>{item.price ? `₦${item.price.toLocaleString()}` : '—'}</Text>
                </View>
                <Text style={styles.cardMeta}>{item.professional.name} · {item.reference}</Text>
                <Badge label={item.status.replace('_', ' ')} tone={STATUS_TONE[item.status]} />
              </View>
            </Pressable>
          )}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  tabs: { flexDirection: 'row', gap: spacing.xs, marginBottom: spacing.md },
  tab: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.pill, backgroundColor: colors.surface },
  tabActive: { backgroundColor: colors.primary },
  tabText: { ...typography.caption, color: colors.textMuted },
  tabTextActive: { color: colors.background },
  card: { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm, gap: spacing.xs },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  cardTitle: { ...typography.label, color: colors.text },
  cardPrice: { ...typography.label, color: colors.text },
  cardMeta: { ...typography.caption, color: colors.textMuted },
});