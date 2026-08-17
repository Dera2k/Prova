import type { ReactNode } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing, typography } from "@/theme";

type ButtonVariant = "primary" | "secondary" | "danger" | "text";

interface ButtonProps {
  children: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  onPress: () => void;
  variant?: ButtonVariant;
}

export function Button({
  children,
  disabled = false,
  loading = false,
  onPress,
  variant = "primary"
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled
      ]}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator color={variant === "primary" ? colors.background : colors.primary} />
        ) : (
          <Text style={[styles.label, styles[`${variant}Label`]]}>{children}</Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    minHeight: 52,
    paddingHorizontal: spacing.lg,
    justifyContent: "center"
  },
  content: {
    alignItems: "center",
    justifyContent: "center"
  },
  label: typography.label,
  primary: { backgroundColor: colors.primary },
  primaryLabel: { color: colors.background },
  secondary: { backgroundColor: colors.surfaceElevated },
  secondaryLabel: { color: colors.text },
  danger: { backgroundColor: colors.danger },
  dangerLabel: { color: colors.white },
  text: { backgroundColor: "transparent" },
  textLabel: { color: colors.primary },
  pressed: { opacity: 0.82 },
  disabled: { opacity: 0.45 }
});