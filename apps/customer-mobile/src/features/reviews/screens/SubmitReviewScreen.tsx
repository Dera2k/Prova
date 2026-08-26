import { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Screen, Button, AppTextInput, AppIcon } from '@/components';
import { colors, spacing, typography } from '@/theme';
import * as reviewApi from '../api';

interface Props {
  bookingId: string;
}

const STARS = [1, 2, 3, 4, 5];

export function SubmitReviewScreen({ bookingId }: Props) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError(undefined);
    if (rating === 0) {
      setError('Select a rating');
      return;
    }
    setSubmitting(true);
    try {
      await reviewApi.submitReview(bookingId, { rating, comment });
      router.replace(`/booking/${bookingId}` as never);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen>
      <Text style={styles.title}>Rate this job</Text>
      <Text style={styles.subtitle}>How was your experience with this professional?</Text>

      <View style={styles.stars}>
        {STARS.map((star) => (
          <Pressable key={star} onPress={() => setRating(star)}>
            <AppIcon
              name={star <= rating ? 'star' : 'star-outline'}
              size={36}
              color={star <= rating ? colors.warning : colors.textSubtle}
            />
          </Pressable>
        ))}
      </View>

      <AppTextInput
        label="Comment (optional)"
        multiline
        numberOfLines={4}
        placeholder="Tell us what went well or what could improve"
        value={comment}
        onChangeText={setComment}
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <Button onPress={handleSubmit} loading={submitting}>Submit review</Button>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.h1, color: colors.text },
  subtitle: { ...typography.body, color: colors.textMuted, marginTop: spacing.xs, marginBottom: spacing.lg },
  stars: { flexDirection: 'row', justifyContent: 'center', gap: spacing.sm, marginBottom: spacing.lg },
  error: { ...typography.caption, color: colors.danger, marginTop: spacing.sm, marginBottom: spacing.sm },
});