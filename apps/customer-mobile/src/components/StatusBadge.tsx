import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography, radius } from '@/theme';

interface StatusBadgeProps {
  status: 'verified' | 'pending' | 'unverified';
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const variants = {
    verified: { bg: colors.success, text: colors.successText, label: 'Verified' },
    pending: { bg: colors.warning, text: colors.warningText, label: 'Pending' },
    unverified: { bg: colors.surface, text: colors.textMuted, label: 'Unverified' },
  };

  const v = variants[status];
  const sizeStyles = size === 'sm' ? styles.sm : styles.md;

  return (
    <View style={[styles.badge, sizeStyles, { backgroundColor: v.bg }]}>
      <Text style={[styles.text, { color: v.text }]}>{v.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
    badge: { borderRadius: radius.pill, alignSelf: 'flex-start' },
  sm: { paddingHorizontal: spacing.xs, paddingVertical: spacing.xxs },
  md: { paddingHorizontal: spacing.sm, paddingVertical: spacing.xs },
  text: { ...typography.caption, fontWeight: '500' },
});