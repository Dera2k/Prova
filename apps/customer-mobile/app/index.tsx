import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Prova</Text>
      <Text style={styles.subtitle}>
        Customer app architecture is ready.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#090F18",
    flex: 1,
    justifyContent: "center",
    padding: 24
  },
  title: {
    color: "#2DD68F",
    fontSize: 36,
    fontWeight: "700"
  },
  subtitle: {
    color: "#A7B2C5",
    fontSize: 16,
    marginTop: 12,
    textAlign: "center"
  }
});