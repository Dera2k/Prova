import type { PropsWithChildren } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, ViewStyle } from "react-native";
import { colors, spacing } from "@/theme";

interface ScreenProps extends PropsWithChildren {
  padded?: boolean;
  style?: ViewStyle;
}

export function Screen({
  children,
  padded = true,
  style
}: ScreenProps) {
  return (
    <SafeAreaView
      edges={["top", "right", "bottom", "left"]}
      style={[styles.screen, padded && styles.padded, style]}
    >
      <StatusBar style="light" />
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
    flex: 1
  },
  padded: {
    paddingHorizontal: spacing.lg
  }
});