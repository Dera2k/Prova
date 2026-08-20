import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Screen, AppIcon, FeedbackState } from '@/components';
import { colors, spacing, typography, radius } from '@/theme';
import * as categoryApi from '../api';
import type { Category } from '../types';

export function HomeScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const cats = await categoryApi.getCategories();
        setCategories(cats);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load services');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <FeedbackState type="loading" title="Loading" message="" />;
  if (error) return <FeedbackState type="error" title="Error" message={error} />;

  return (
    <Screen>
      <View style={styles.header}>
        <View style={styles.location}>
          <AppIcon name="location-outline" size={16} color={colors.textMuted} />
          <Text style={styles.locationText}>Alagomji, Yaba</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>What needs fixing?</Text>

      <FlatList
        data={categories}
        keyExtractor={(c) => c.id}
        scrollEnabled={false}
        numColumns={2}
        columnWrapperStyle={styles.grid}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/professional/category/${item.id}` as never)}
            style={styles.categoryTile}
          >
            <View style={styles.categoryIcon}>
              <AppIcon name={(item.icon as never) || 'help-circle'} size={28} color={colors.primary} />
            </View>
            <Text style={styles.categoryName}>{item.name}</Text>
          </Pressable>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: spacing.lg },
  location: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  locationText: { ...typography.body, color: colors.textMuted },
  sectionTitle: { ...typography.h2, color: colors.text, marginBottom: spacing.md },
  grid: { gap: spacing.sm, marginBottom: spacing.sm },
  categoryTile: { flex: 1, backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.md, alignItems: 'center', gap: spacing.sm },
  categoryIcon: { width: 48, height: 48, borderRadius: radius.md, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
  categoryName: { ...typography.label, color: colors.text, textAlign: 'center' },
});