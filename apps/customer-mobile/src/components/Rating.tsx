import { StyleSheet, Text, View } from "react-native";
import { AppIcon } from "./AppIcon";
import { colors, spacing, typography } from "@/theme";

interface RatingProps {
  rating: number;
  reviewCount?: number;
}

export function Rating({ rating, reviewCount }: RatingProps) {
  return (
    <View accessibilityLabel={`${rating} out of 5 stars`} style={styles.row}>
      <AppIcon color={colors.warning} name="star" size={16} />
      <Text style={styles.rating}>{rating.toFixed(1)}</Text>
      {reviewCount !== undefined ? (
        <Text style={styles.count}>({reviewCount})</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { alignItems: "center", flexDirection: "row", gap: spacing.xxs },
  rating: { ...typography.label, color: colors.text },
  count: { ...typography.caption, color: colors.textMuted }
});