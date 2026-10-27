import { Modal, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme';
import { Icon, IconName } from './Icon';

export type MenuItem = {
  label: string;
  icon?: IconName;
  color?: string;
  onPress: () => void;
};

// Vị trí của nút bấm trên màn hình (từ measureInWindow)
export type Anchor = { x: number; y: number; width: number; height: number };

type Props = {
  anchor: Anchor | null; // null = đang đóng
  items: MenuItem[];
  onClose: () => void;
};

// Menu nhỏ hiện ngay dưới nút bấm, căn phải theo nút
export function PopupMenu({ anchor, items, onClose }: Props) {
  const { width } = useWindowDimensions();
  return (
    <Modal visible={anchor !== null} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Close menu" />
      {anchor && (
        <View style={[styles.menu, { top: anchor.y + anchor.height + 4, right: width - (anchor.x + anchor.width) }]}>
          {items.map((item) => (
            <Pressable
              key={item.label}
              style={styles.item}
              onPress={() => {
                onClose();
                item.onPress();
              }}
            >
              {item.icon && <Icon name={item.icon} color={item.color ?? colors.text} />}
              <Text style={[styles.label, item.color ? { color: item.color } : null]}>{item.label}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  menu: {
    position: 'absolute',
    minWidth: 136,
    padding: spacing.sm,
    borderRadius: radius.card,
    backgroundColor: colors.surface,
  },
  item: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 8, paddingVertical: 10 },
  label: { ...typography.caption, color: colors.text },
});
