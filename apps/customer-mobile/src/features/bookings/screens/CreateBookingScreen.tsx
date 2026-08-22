import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Screen, Button, AppTextInput, AppIcon } from '@/components';
import { MediaAttachment } from '@/components/MediaAttachment';
import { colors, spacing, typography, radius } from '@/theme';
import { usePhotoPicker } from '@/features/media/usePhotoPicker';
import { uploadMedia } from '@/features/media/uploadMedia';
import { useCurrentLocation } from '@/features/location/useCurrentLocation';
import * as bookingApi from '../api';
import type { PickedMedia, UploadedMedia } from '@/features/media/types';

type ScheduleOption = 'asap' | 'today-evening' | 'tomorrow-morning' | 'custom';

export function CreateBookingScreen() {
  const { professionalId, serviceId } = useLocalSearchParams<{ professionalId: string; serviceId: string }>();
  const [description, setDescription] = useState('');
  const [media, setMedia] = useState<{ picked: PickedMedia; uploaded?: UploadedMedia; uploading: boolean }[]>([]);
  const [schedule, setSchedule] = useState<ScheduleOption>('asap');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>();

  const { pickFromLibrary, takePhoto } = usePhotoPicker();
  const { location } = useCurrentLocation();

  const addMedia = async (fromCamera: boolean) => {
    const picked = fromCamera ? await takePhoto() : await pickFromLibrary();
    if (!picked) return;

    const entry = { picked, uploading: true };
    setMedia((prev) => [...prev, entry]);

    try {
      const uploaded = await uploadMedia(picked);
      setMedia((prev) => prev.map((m) => (m.picked.uri === picked.uri ? { ...m, uploaded, uploading: false } : m)));
    } catch {
      setMedia((prev) => prev.filter((m) => m.picked.uri !== picked.uri));
      setError('Failed to upload media. Try again.');
    }
  };

  const removeMedia = (uri: string) => {
    setMedia((prev) => prev.filter((m) => m.picked.uri !== uri));
  };

  const handleSubmit = async () => {
    setError(undefined);
    if (!description.trim()) {
      setError('Describe the problem');
      return;
    }
    if (!address.trim() && !location) {
      setError('Add a service address');
      return;
    }

    setSubmitting(true);
    try {
      const booking = await bookingApi.createBooking({
        professionalId,
        serviceId,
        description,
        attachmentUrls: media.filter((m) => m.uploaded).map((m) => m.uploaded!),
        newAddress: location
          ? { street: address, area: '', city: '', state: '', country: 'Nigeria', latitude: location.latitude, longitude: location.longitude }
          : undefined,
        notes: notes || undefined,
      });
      router.replace(`/booking/quotation/${booking.id}` as never);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Create booking</Text>

        <Text style={styles.label}>Describe the problem</Text>
        <AppTextInput
        label="Job description"
          multiline
          numberOfLines={4}
          placeholder="e.g. Water is leaking heavily from under the kitchen sink."
          value={description}
          onChangeText={setDescription}
        />

        <Text style={styles.label}>Add photos or a short video</Text>
        <Text style={styles.hint}>This helps the pro quote accurately before arriving.</Text>
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
          <Pressable style={styles.mediaButton} onPress={() => addMedia(true)}>
            <AppIcon name="camera-outline" size={22} color={colors.textMuted} />
            <Text style={styles.mediaButtonText}>Photo</Text>
          </Pressable>
          <Pressable style={styles.mediaButton} onPress={() => addMedia(false)}>
            <AppIcon name="videocam-outline" size={22} color={colors.textMuted} />
            <Text style={styles.mediaButtonText}>Video</Text>
          </Pressable>
        </View>

        <Text style={styles.label}>When do you need it?</Text>
        <View style={styles.scheduleGrid}>
          {([
            ['asap', 'As soon as possible'],
            ['today-evening', 'Today, 6:00 PM'],
            ['tomorrow-morning', 'Tomorrow, 9:00 AM'],
            ['custom', 'Pick a date'],
          ] as [ScheduleOption, string][]).map(([value, label]) => (
            <Pressable
              key={value}
              style={[styles.scheduleOption, schedule === value && styles.scheduleOptionActive]}
              onPress={() => setSchedule(value)}
            >
              <Text style={[styles.scheduleText, schedule === value && styles.scheduleTextActive]}>{label}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Service address</Text>
        <AppTextInput
        label="Service address"
          placeholder="Enter address"
          value={address}
          onChangeText={setAddress}
        />

        <Text style={styles.label}>Notes for the professional (optional)</Text>
        <AppTextInput
        label="Notes for the professional (optional)"
          placeholder="Gate code, landmark, best entrance…"
          value={notes}
          onChangeText={setNotes}
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <Button onPress={handleSubmit} loading={submitting}>Send request</Button>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.h1, color: colors.text, marginBottom: spacing.lg },
  label: { ...typography.label, color: colors.text, marginTop: spacing.lg, marginBottom: spacing.xs },
  hint: { ...typography.caption, color: colors.textMuted, marginBottom: spacing.sm },
  mediaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  mediaButton: { width: 72, height: 72, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', gap: spacing.xxs },
  mediaButtonText: { ...typography.caption, color: colors.textMuted },
  scheduleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  scheduleOption: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border },
  scheduleOptionActive: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  scheduleText: { ...typography.caption, color: colors.textMuted },
  scheduleTextActive: { color: colors.primary },
  error: { ...typography.caption, color: colors.danger, marginTop: spacing.sm },
});