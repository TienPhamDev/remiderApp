import { ComponentRef, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme';
import { Category } from '../types/category';
import { Icon } from './Icon';
import { Anchor, PopupMenu } from './PopupMenu';

type Props = {
  category: Category;
  doneCount: number;
  totalCount: number;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
};

// Một danh mục: tên, số việc đã xong / tổng, nút "•••" mở menu Edit / Delete
export function CategoryRow({ category, doneCount, totalCount, onEdit, onDelete }: Props) {
  const buttonRef = useRef<ComponentRef<typeof Pressable>>(null);
  const [anchor, setAnchor] = useState<Anchor | null>(null);

  // Đo vị trí nút để đặt menu ngay dưới nó
  const openMenu = () => buttonRef.current?.measureInWindow((x, y, width, height) => setAnchor({ x, y, width, height }));

  return (
    <View style={styles.card}>
      <View style={styles.texts}>
        <Text style={styles.name} numberOfLines={1}>
          {category.name}
        </Text>
        <Text style={styles.count}>
          {doneCount}/{totalCount} task
        </Text>
      </View>
      <Pressable
        ref={buttonRef}
        style={styles.more}
        onPress={openMenu}
        hitSlop={8}
        accessibilityLabel={`Options for ${category.name}`}
      >
        <Icon name="more" />
      </Pressable>
      <PopupMenu
        anchor={anchor}
        onClose={() => setAnchor(null)}
        items={[
          { label: 'Edit', icon: 'edit', onPress: () => onEdit(category) },
          { label: 'Delete', icon: 'trash', color: colors.danger, onPress: () => onDelete(category) },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: radius.card,
    backgroundColor: colors.card,
  },
  texts: { flex: 1 },
  name: { ...typography.body, color: colors.text },
  count: { ...typography.caption, color: colors.accent },
  more: { padding: 4 },
});
