import type { ReactNode } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Button } from "./Button";
import { colors, spacing, typography } from "@/theme";

interface FeedbackStateProps {
  actionLabel?: string;
  icon?: ReactNode;
  message: string;
  onAction?: () => void;
  title: string;
  type: "empty" | "error" | "loading";
}

export function FeedbackState({
  actionLabel,
  icon,
  message,
  onAction,
  title,
  type
}: FeedbackStateProps) {
  return (
    <View style={styles.container}>
      {type === "loading" ? <ActivityIndicator color={colors.primary} size="large" /> : icon}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {onAction && actionLabel ? (
        <Button onPress={onAction} variant="secondary">
          {actionLabel}
        </Button>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: spacing.sm,
    justifyContent: "center",
    padding: spacing.xxl
  },
  title: { ...typography.h3, color: colors.text, textAlign: "center" },
  message: { ...typography.body, color: colors.textMuted, textAlign: "center" }
});