// The clean twin of bad.tsx: nothing here may fire (nativeLintRules.test.ts).
import { Text, View } from "react-native";
import { useStyles } from "../../src/theme/ThemeProvider.js";

export function Good({ label }: { label: string }) {
  const styles = useStyles("bg-violet-600 px-4 py-2 text-violet-50");
  return (
    <View style={styles.box.idle}>
      <Text style={styles.text.idle}>{label}</Text>
      {label}
    </View>
  );
}
