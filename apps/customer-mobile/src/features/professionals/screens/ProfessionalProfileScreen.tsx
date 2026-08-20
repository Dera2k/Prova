import { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Screen, Avatar, Rating, Button, FeedbackState, StatusBadge, Card } from '@/components';
import { colors, spacing, typography } from '@/theme';
import * as profApi from '../api';
import type { ProfessionalProfile } from '../types';

interface Props {
  id: string;
}

export function ProfessionalProfileScreen({ id }: Props) {
  const [pro, setPro] = useState<ProfessionalProfile | null>(null);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const result = await profApi.getProfessional(id);
        setPro(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <FeedbackState type="loading" title="Loading" message="" />;
  if (error || !pro) return <FeedbackState type="error" title="Error" message={error || 'Not found'} />;

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Avatar name={pro.name} photoUrl={pro.profilePhotoUrl} size={80} />
          <View style={styles.headerText}>
            <Text style={styles.name}>{pro.name}</Text>
            <StatusBadge status={pro.verificationStatus === 'VERIFIED' ? 'verified' : 'pending'} />
          </View>
        </View>

        <View style={styles.stats}>
          <Card>
            <Text style={styles.statLabel}>{pro.rating.toFixed(1)}</Text>
            <Text style={styles.statValue}>{pro.reviewCount} reviews</Text>
          </Card>
          <Card>
            <Text style={styles.statLabel}>{pro.yearsOfExperience}</Text>
            <Text style={styles.statValue}>years exp</Text>
          </Card>
          <Card>
            <Text style={styles.statLabel}>{pro.responseTimeMinutes || '—'}</Text>
            <Text style={styles.statValue}>min response</Text>
          </Card>
        </View>

        {pro.bio && (
          <>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.bio}>{pro.bio}</Text>
          </>
        )}

        <Text style={styles.sectionTitle}>Services</Text>
        <View style={styles.services}>
          {pro.services.map((s) => (
            <View key={s.id} style={styles.serviceTag}>
              <Text style={styles.serviceText}>{s.name}</Text>
            </View>
          ))}
        </View>

        {pro.recentReviews.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Reviews</Text>
            {pro.recentReviews.map((r, i) => (
              <Card key={i}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewAuthor}>{r.author}</Text>
                  <Rating rating={r.rating} size="sm" />
                </View>
                <Text style={styles.reviewText}>{r.text}</Text>
                <Text style={styles.reviewDate}>{r.date}</Text>
              </Card>
            ))}
          </>
        )}

        <Button onPress={() => router.push(`/booking/create?professionalId=${id}`)}>Book now</Button>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg, alignItems: 'flex-start' },
  headerText: { flex: 1, gap: spacing.xs },
  name: { ...typography.h2, color: colors.text },
  stats: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  statLabel: { ...typography.h3, color: colors.primary },
  statValue: { ...typography.caption, color: colors.textMuted },
  sectionTitle: { ...typography.h3, color: colors.text, marginTop: spacing.lg, marginBottom: spacing.sm },
  bio: { ...typography.body, color: colors.textMuted, lineHeight: 20 },
  services: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  serviceTag: { backgroundColor: colors.primary, borderRadius: 16, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs },
  serviceText: { ...typography.caption, color: colors.background },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  reviewAuthor: { ...typography.label, color: colors.text },
  reviewText: { ...typography.body, color: colors.textMuted, lineHeight: 18, marginVertical: spacing.xs },
  reviewDate: { ...typography.caption, color: colors.textSubtle },
});