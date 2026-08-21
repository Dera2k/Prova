import { useState, useEffect } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Screen, AppIcon, Button, FeedbackState } from '@/components';
import { colors, spacing, typography, radius } from '@/theme';
import * as locationApi from '../api';
import type { Address } from '../types';

export function SavedAddressesScreen() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  const load = async () => {
    try {
      const result = await locationApi.getAddresses();
      setAddresses(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    await locationApi.deleteAddress(id);
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  if (loading) return <FeedbackState type="loading" title="Loading" message="" />;
  if (error) return <FeedbackState type="error" title="Error" message={error} />;

  return (
    <Screen>
      <FlatList
        data={addresses}
        keyExtractor={(a) => a.id}
        scrollEnabled={false}
        ListEmptyComponent={
          <FeedbackState
            type="empty"
            title="No saved addresses"
            message="Add an address to book faster next time."
          />
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <AppIcon name="location" size={20} color={colors.primary} />
            <View style={styles.info}>
              <Text style={styles.label}>{item.label}</Text>
              <Text style={styles.address}>{item.street}, {item.area}</Text>
            </View>
            <Pressable onPress={() => handleDelete(item.id)}>
              <AppIcon name="trash-outline" size={18} color={colors.textMuted} />
            </Pressable>
          </View>
        )}
      />
      <Button onPress={() => router.push('/tabs/profile' as never)}>Add address</Button>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.surface, padding: spacing.md, borderRadius: radius.md, marginBottom: spacing.sm },
  info: { flex: 1, gap: spacing.xxs },
  label: { ...typography.label, color: colors.text },
  address: { ...typography.caption, color: colors.textMuted },
});