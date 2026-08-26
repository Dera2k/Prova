import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Screen, Button, AppTextInput, AppIcon } from '@/components';
import { MediaAttachment } from '@/components/MediaAttachment';
import { colors, spacing, typography, radius } from '@/theme';
import { usePhotoPicker } from '@/features/media/usePhotoPicker';
import { uploadMedia } from '@/features/media/uploadMedia';
import * as disputeApi from '../api';
import { DISPUTE_REASONS } from '../types';
import type { PickedMedia, UploadedMedia } from '@/features/media/types';

interface Props {
  bookingId: string;
}

export function SubmitDisputeScreen({ bookingId }: Props) {
  const [reason, setReason] = useState<string>();
  const [description, setDescription] = useState('');
  const [media, setMedia] = useState<{ picked: PickedMedia; uploaded?: UploadedMedia; uploading: boolean }[]>([]);
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);
  const { pickFromLibrary } = usePhotoPicker();
  
  const addMedia = async () => {
    const picked = await pickFromLibrary(false);
    if (!picked) return;
    const entry = { picked, uploading: true };
    setMedia((prev) => [...prev, entry]);
    try {
      const uploaded = await uploadMedia(picked);
      setMedia((prev) => prev.map((m) => (m.picked.uri === picked.uri ? { ...m, uploaded, uploading: false } : m)));
    } catch {
      setMedia((prev) => prev.filter((m) => m.picked.uri !== picked.uri));
    }
  };

  const removeMedia = (uri: string) => {
    setMedia((prev) => prev.filter((m) => m.picked.uri !== uri));
  };

  const handleSubmit = async () => {
    setError(undefined);
    if (!reason) {
      setError('Select a reason');
      return;
    }
    if (!description.trim()) {
      setError('Describe what happened');
      return;
    }
    setSubmitting(true);
    try {
      await disputeApi.submitDispute(bookingId, {
        reason,
        description,
        attachmentUrls: media.filter((m) => m.uploaded).map((m) => m.uploaded!.url),
      });
      router.replace(`/booking/${bookingId}` as never);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit dispute');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Report a problem</Text>

        <Text style={styles.label}>What went wrong?</Text>
        <View style={styles.reasons}>
          {DISPUTE_REASONS.map((r) => (
            <Pressable
              key={r}
              style={[styles.reasonOption, reason === r && styles.reasonOptionActive]}
              onPress={() => setReason(r)}
            >
              <Text style={[styles.reasonText, reason === r && styles.reasonTextActive]}>{r}</Text>
            </Pressable>
          ))}
        </View>

        <AppTextInput
          label="Describe what happened"
          multiline
          numberOfLines={4}
          placeholder="Give as much detail as you can"
          value={description}
          onChangeText={setDescription}
        />

        <Text style={styles.label}>Add evidence (optional)</Text>
        <View style={styles.mediaRow}>
          {media.map((m) => (
            <MediaAttachment
              key={m.picked.uri}
              uri={m.picked.uri}
              type={m.picked.type}
              uploading={m.uploading}
              onRemove={() => removeMedia(m.picked.uri)}
            />
          ))}
          <Pressable style={styles.mediaButton} onPress={addMedia}>
            <AppIcon name="camera-outline" size={22} color={colors.textMuted} />
          </Pressable>
        </View>

        {error && <Text style={styles.error}>{error}</Text>}

        <Button variant="danger" onPress={handleSubmit} loading={submitting}>Submit dispute</Button>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.h1, color: colors.text, marginBottom: spacing.lg },
  label: { ...typography.label, color: colors.text, marginTop: spacing.lg, marginBottom: spacing.sm },
  reasons: { gap: spacing.xs },
  reasonOption: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border },
  reasonOptionActive: { borderColor: colors.danger, backgroundColor: colors.surface },
  reasonText: { ...typography.body, color: colors.textMuted },
  reasonTextActive: { color: colors.danger },
  mediaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  mediaButton: { width: 72, height: 72, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },
  error: { ...typography.caption, color: colors.danger, marginTop: spacing.sm, marginBottom: spacing.sm },
});