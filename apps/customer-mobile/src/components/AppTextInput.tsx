import type { TextInputProps } from "react-native";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { colors, radius, spacing, typography } from "@/theme";

interface AppTextInputProps extends TextInputProps {
  error?: string;
  label: string;
}

export function AppTextInput({
  error,
  label,
  ...inputProps
}: AppTextInputProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={colors.textSubtle}
        style={[styles.input, error ? styles.inputError : undefined]}
        {...inputProps}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: spacing.xs },
  label: { ...typography.label, color: colors.text },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    color: colors.text,
    fontSize: 16,
    minHeight: 52,
    paddingHorizontal: spacing.md
  },
  inputError: { borderColor: colors.danger },
  error: { ...typography.caption, color: colors.danger }
});