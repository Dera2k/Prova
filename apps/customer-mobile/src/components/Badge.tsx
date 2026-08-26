import { StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing, typography } from "@/theme";

type BadgeTone = "success" | "warning" | "danger" | "neutral";

interface BadgeProps {
  label: string;
  tone?: BadgeTone;
}

export function Badge({ label, tone = "neutral" }: BadgeProps) {
  return (
    <View style={[styles.badge, styles[tone]]}>
      <Text style={[styles.label, styles[`${tone}Label`]]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
  },
  label: typography.caption,
  success: { backgroundColor: colors.primarySoft },
  successLabel: { color: colors.primary },
  warning: { backgroundColor: colors.primarySoft },
  warningLabel: { color: colors.warning },
  danger: { backgroundColor: colors.primarySoft },
  dangerLabel: { color: colors.danger },
  neutral: { backgroundColor: colors.surfaceElevated },
  neutralLabel: { color: colors.textMuted },
});