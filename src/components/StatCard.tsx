import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, typography } from '../theme';

type Props = {
  value: number;
  label: string;
};

// Ô thống kê: số lớn ở trên, nhãn nhỏ bên dưới
export function StatCard({ value, label }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderRadius: radius.card + 4,
    backgroundColor: colors.panel,
  },
  value: { ...typography.body, fontSize: 32, lineHeight: 40, color: colors.text },
  label: { ...typography.caption, color: colors.textMuted },
});
