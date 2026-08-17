import { StyleSheet, Text, View } from "react-native";
import { Avatar, Badge, Button, Card, Rating, Screen } from "@/components";
import { colors, spacing, typography } from "@/theme";

export default function Index() {
  return (
    <Screen>
      <View style={styles.content}>
        <Text style={styles.title}>Prova</Text>
        <Text style={styles.subtitle}>Design system ready.</Text>

        <Card>
          <View style={styles.profileRow}>
            <Avatar name="Emeka Okafor" />
            <View>
              <Text style={styles.name}>Emeka Okafor</Text>
              <Rating rating={4.9} reviewCount={214} />
            </View>
            <Badge label="Verified" tone="success" />
          </View>
        </Card>

        <Button onPress={() => {}}>Primary action</Button>
        <Button onPress={() => {}} variant="secondary">
          Secondary action
        </Button>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    gap: spacing.lg,
    justifyContent: "center"
  },
  title: { ...typography.display, color: colors.primary },
  subtitle: { ...typography.body, color: colors.textMuted },
  profileRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm
  },
  name: { ...typography.h3, color: colors.text, marginBottom: spacing.xxs }
});