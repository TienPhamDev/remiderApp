import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme';
import { Icon } from './Icon';

type Props = {
  categories: { value: string; label: string }[];
  selected: string;
  onSelect: (category: string) => void;
};

// Hàng chip danh mục: nút thêm (nét đứt) + các chip cuộn ngang
export function CategoryChips({ categories, selected, onSelect }: Props) {
  return (
    <View style={styles.row}>
      <Pressable style={styles.add} accessibilityLabel="Add category">
        <Icon name="add" />
      </Pressable>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {categories.map(({ value, label }) => {
          const active = value === selected;
          return (
            <Pressable
              key={value}
              onPress={() => onSelect(value)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  add: {
    width: 70,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.card,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
  },
  chips: { gap: spacing.sm, paddingRight: spacing.md },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: radius.chip,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  chipText: { ...typography.caption, lineHeight: 24, color: colors.textMuted },
  chipTextActive: { color: colors.onAccent },
});
