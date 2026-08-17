import { StyleSheet, Text, View } from "react-native";
import { Screen } from "./Screen";
import { colors, spacing, typography } from "@/theme";

interface PlaceholderScreenProps {
  description: string;
  title: string;
}

export function PlaceholderScreen({
  description,
  title
}: PlaceholderScreenProps) {
  return (
    <Screen>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    gap: spacing.sm,
    justifyContent: "center"
  },
  title: {
    ...typography.h1,
    color: colors.text
  },
  description: {
    ...typography.body,
    color: colors.textMuted
  }
});