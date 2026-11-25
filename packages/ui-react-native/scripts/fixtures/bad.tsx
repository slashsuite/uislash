// Planted: every native lint rule must fire on this file (nativeLintRules.test.ts).
import { Pressable, StyleSheet, View } from "react-native";
import { useStyles } from "../../src/theme/ThemeProvider.js";

const sheet = StyleSheet.create({ box: { padding: 4 } });

export function Bad() {
  const styles = useStyles("bg-violet-600 shadow-glow");
  return (
    <View style={[sheet.box, styles.box.idle, { backgroundColor: "#ff0000" }]}>
      Hello
      <Pressable onPress={() => undefined}>press me</Pressable>
      {`${styles.box.idle.gap ?? 0} apart`}
    </View>
  );
}
