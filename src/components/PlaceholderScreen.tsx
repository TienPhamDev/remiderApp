import { StyleSheet, Text, View } from 'react-native';
import { colors, typography } from '../theme';

// Màn hình tạm cho các tab chưa làm
export function PlaceholderScreen({ title }: { title: string }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  text: { ...typography.section, color: colors.textMuted },
});
