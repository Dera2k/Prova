import { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Screen, Avatar, Rating, FeedbackState, Button } from '@/components';
import { colors, spacing, typography } from '@/theme';
import * as profApi from '../api';
import { useCurrentLocation } from '@/features/location/useCurrentLocation';
import type { Professional } from '../types';

interface Props {
  categoryId: string;
}

export function ProfessionalListScreen({ categoryId }: Props) {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(true);
  const { location } = useCurrentLocation();

  useEffect(() => {
    if (!location) return;
    (async () => {
      try {
        const result = await profApi.getProfessionalsByCategory(
          categoryId,
          location.latitude,
          location.longitude,
        );
        setProfessionals(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load professionals');
      } finally {
        setLoading(false);
      }
    })();
  }, [categoryId, location]);

  if (loading) return <FeedbackState type="loading" title="Loading" message="" />;
  if (error) return <FeedbackState type="error" title="Error" message={error} />;

  return (
    <Screen>
      <FlatList
        data={professionals}
        keyExtractor={(p) => p.id}
        gap={spacing.sm}
        renderItem={({ item }) => (
          <Pressable onPress={() => router.push(`/professional/${item.id}`)}>
            <View style={styles.card}>
              <Avatar name={item.name} photoUrl={item.profilePhotoUrl} size={48} />
              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.meta}>{item.yearsOfExperience} yrs exp</Text>
                <View style={styles.ratingRow}>
                  <Rating rating={item.rating} size="sm" />
                  <Text style={styles.reviewCount}>({item.reviewCount})</Text>
                  {item.distance && <Text style={styles.distance}>{item.distance.toFixed(1)} km</Text>}
                </View>
              </View>
              <Button size="sm" onPress={() => router.push(`/professional/${item.id}`)}>View</Button>
            </View>
          </Pressable>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.surface, padding: spacing.md, borderRadius: 8 },
  info: { flex: 1, gap: spacing.xxs },
  name: { ...typography.label, color: colors.text },
  meta: { ...typography.caption, color: colors.textMuted },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  reviewCount: { ...typography.caption, color: colors.textMuted },
  distance: { ...typography.caption, color: colors.primary },
});