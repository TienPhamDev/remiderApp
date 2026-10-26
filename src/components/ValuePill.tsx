import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, typography } from '../theme';

type Props = {
  text: string;
  onPress: () => void;
};

// Viên thuốc hiển thị giá trị, bấm để đổi sang giá trị kế tiếp
export function ValuePill({ text, onPress }: Props) {
  return (
    <Pressable style={styles.pill} onPress={onPress}>
      <Text style={styles.text}>{text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, backgroundColor: colors.input },
  text: { ...typography.caption, color: colors.text },
});
