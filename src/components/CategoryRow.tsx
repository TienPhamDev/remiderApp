import { ComponentRef, useRef, useState } from 'react';
import { GestureResponderHandlers, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme';
import { Category } from '../types/category';
import { Icon } from './Icon';
import { Anchor, PopupMenu } from './PopupMenu';

// Chiều cao cố định của một dòng (để danh sách kéo thả tính vị trí)
export const CATEGORY_ROW_HEIGHT = 64;

type Props = {
  category: Category;
  handleProps: GestureResponderHandlers; // gắn vào tay nắm kéo thả
  dragging: boolean;
  doneCount: number;
  totalCount: number;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
};

// Một danh mục: tay nắm kéo thả, tên, số việc đã xong / tổng, nút "•••" mở menu Edit / Delete
export function CategoryRow({ category, handleProps, dragging, doneCount, totalCount, onEdit, onDelete }: Props) {
  const buttonRef = useRef<ComponentRef<typeof Pressable>>(null);
  const [anchor, setAnchor] = useState<Anchor | null>(null);

  // Đo vị trí nút để đặt menu ngay dưới nó
  const openMenu = () => buttonRef.current?.measureInWindow((x, y, width, height) => setAnchor({ x, y, width, height }));

  return (
    <View style={[styles.card, dragging && styles.cardDragging]}>
      <View style={styles.handle} hitSlop={8} accessibilityLabel={`Reorder ${category.name}`} {...handleProps}>
        <Icon name="grip" color={colors.textMuted} />
      </View>
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
    height: CATEGORY_ROW_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: colors.card,
  },
  cardDragging: { borderColor: colors.primary },
  handle: { marginLeft: -8 },
  texts: { flex: 1 },
  name: { ...typography.body, color: colors.text },
  count: { ...typography.caption, color: colors.accent },
  more: { padding: 4 },
});
