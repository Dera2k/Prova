import { View, Text, StyleSheet } from 'react-native';
import { AppIcon } from './AppIcon';
import { colors, spacing, typography } from '@/theme';
import type { BookingStatus, BookingStatusHistoryEntry } from '@/features/bookings/types';

const STATUS_LABELS: Record<BookingStatus, string> = {
  PENDING: 'Request sent',
  ACCEPTED: 'Professional accepted',
  ON_THE_WAY: 'On the way',
  ARRIVED: 'Arrived',
  IN_PROGRESS: 'Work in progress',
  COMPLETED: 'Job completed',
  CANCELLED: 'Cancelled',
  DISPUTED: 'Disputed',
};

const ORDER: BookingStatus[] = ['PENDING', 'ACCEPTED', 'ON_THE_WAY', 'ARRIVED', 'IN_PROGRESS', 'COMPLETED'];

interface StatusTimelineProps {
  currentStatus: BookingStatus;
  history: BookingStatusHistoryEntry[];
}

export function StatusTimeline({ currentStatus, history }: StatusTimelineProps) {
  const currentIndex = ORDER.indexOf(currentStatus);
  const historyMap = new Map(history.map((h) => [h.status, h.timestamp]));

  if (currentStatus === 'CANCELLED' || currentStatus === 'DISPUTED') {
    return (
      <View style={styles.row}>
        <AppIcon name={currentStatus === 'CANCELLED' ? 'close-circle' : 'alert-circle'} size={20} color={colors.danger} />
        <Text style={styles.dangerLabel}>{STATUS_LABELS[currentStatus]}</Text>
      </View>
    );
  }

  return (
    <View>
      {ORDER.map((status, i) => {
        const isDone = i <= currentIndex;
        const isCurrent = i === currentIndex;
        const timestamp = historyMap.get(status);

        return (
          <View key={status} style={styles.row}>
            <View style={styles.iconColumn}>
              <AppIcon
                name={isDone ? (isCurrent ? 'ellipse' : 'checkmark-circle') : 'ellipse-outline'}
                size={20}
                color={isDone ? colors.primary : colors.textSubtle}
              />
              {i < ORDER.length - 1 && (
                <View style={[styles.connector, isDone && i < currentIndex && styles.connectorDone]} />
              )}
            </View>
            <View style={styles.textColumn}>
              <Text style={[styles.label, isDone && styles.labelDone]}>{STATUS_LABELS[status]}</Text>
              {timestamp && <Text style={styles.timestamp}>{timestamp}</Text>}
              {isCurrent && !timestamp && <Text style={styles.pending}>Not started</Text>}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center' },
  iconColumn: { alignItems: 'center' },
  connector: { width: 2, height: 24, backgroundColor: colors.border },
  connectorDone: { backgroundColor: colors.primary },
  textColumn: { flex: 1, paddingBottom: spacing.md },
  label: { ...typography.body, color: colors.textSubtle },
  labelDone: { color: colors.text },
  timestamp: { ...typography.caption, color: colors.textMuted },
  pending: { ...typography.caption, color: colors.textSubtle },
  dangerLabel: { ...typography.label, color: colors.danger },
});