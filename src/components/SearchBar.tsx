import { Keyboard, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, radius, typography } from '../theme';
import { Icon } from './Icon';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
};

// Ô tìm việc dạng viên thuốc, có nút Search màu tím bên phải (lọc ngay khi gõ)
export function SearchBar({ value, onChangeText }: Props) {
  return (
    <View style={styles.box}>
      <Icon name="search" />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="Try to find task...."
        placeholderTextColor={colors.textMuted}
        returnKeyType="search"
      />
      <Pressable style={styles.button} onPress={Keyboard.dismiss}>
        <Text style={styles.buttonText}>Search</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingLeft: 12,
    paddingRight: 8,
    borderRadius: radius.chip,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: { ...typography.caption, flex: 1, color: colors.text, height: '100%' },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
  buttonText: { ...typography.caption, color: colors.text },
});
