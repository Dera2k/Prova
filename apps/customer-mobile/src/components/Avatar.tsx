import { Image, StyleSheet, Text, View } from "react-native";
import { colors, radius, typography } from "@/theme";

interface AvatarProps {
  name: string;
  size?: number;
  uri?: string;
}

export function Avatar({ name, size = 48, uri }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (uri) {
    return <Image source={{ uri }} style={{ borderRadius: radius.pill, height: size, width: size }} />;
  }

  return (
    <View style={[styles.fallback, { borderRadius: radius.pill, height: size, width: size }]}>
      <Text style={styles.initials}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: {
    alignItems: "center",
    backgroundColor: colors.surfaceElevated,
    justifyContent: "center"
  },
  initials: {
    ...typography.label,
    color: colors.text
  }
});