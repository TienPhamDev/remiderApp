import { ReactNode, useRef, useState } from 'react';
import { Animated, PanResponder, Platform, Pressable, StyleSheet, View } from 'react-native';
import { colors, radius } from '../theme';
import { Icon } from './Icon';

const OPEN_OFFSET = 72; // khoảng thẻ trượt sang trái để lộ nút xóa

type Props = {
  children: ReactNode;
  onDelete: () => void;
  label: string; // mô tả nút xóa cho trợ năng
};

// Vuốt thẻ sang trái để lộ nút xóa (nền đỏ nhạt + thùng rác). Chỉ nhận cử chỉ khi vuốt ngang
export function SwipeToDelete({ children, onDelete, label }: Props) {
  const x = useRef(new Animated.Value(0)).current;
  const openRef = useRef(false);
  const [open, setOpen] = useState(false);
  const [swiping, setSwiping] = useState(false); // đang vuốt (hoặc vừa vuốt xong)

  // Trượt tới vị trí mở hoặc đóng
  const settle = (toOpen: boolean) => {
    openRef.current = toOpen;
    setOpen(toOpen);
    Animated.timing(x, { toValue: toOpen ? -OPEN_OFFSET : 0, duration: 180, useNativeDriver: Platform.OS !== 'web' }).start();
  };

  const positionAfter = (dx: number) => Math.min(0, Math.max(-OPEN_OFFSET, (openRef.current ? -OPEN_OFFSET : 0) + dx));

  // Kết thúc vuốt: trượt về vị trí mở/đóng, giữ lớp chắn thêm chút để cú thả không bị tính là chạm
  const finish = (dx: number) => {
    settle(positionAfter(dx) < -OPEN_OFFSET / 2);
    setTimeout(() => setSwiping(false), 250);
  };

  const responder = useRef(
    PanResponder.create({
      // Vuốt ngang rõ ràng mới nhận, để cuộn dọc và chạm vẫn hoạt động bình thường
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 10 && Math.abs(g.dx) > Math.abs(g.dy) * 1.5,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => setSwiping(true),
      onPanResponderMove: (_, g) => x.setValue(positionAfter(g.dx)),
      // Thả quá nửa đường thì mở, ngược lại đóng
      onPanResponderRelease: (_, g) => finish(g.dx),
      onPanResponderTerminate: (_, g) => finish(g.dx),
    }),
  ).current;

  const handleDelete = () => {
    settle(false); // đóng lại ngay, nên hủy hộp thoại xác nhận thì thẻ đã về chỗ cũ
    onDelete();
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.deleteButton} onPress={handleDelete} hitSlop={8} accessibilityLabel={label}>
        <Icon name="trash" color={colors.danger} />
      </Pressable>
      <Animated.View style={{ transform: [{ translateX: x }] }} {...responder.panHandlers}>
        {children}
        {/* Đang mở hoặc đang vuốt: chạm vào thẻ chỉ để đóng lại, không mở chi tiết */}
        {(open || swiping) && (
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => openRef.current && settle(false)}
            accessibilityLabel="Close"
          />
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { borderRadius: radius.card, backgroundColor: colors.dangerSoft },
  deleteButton: { position: 'absolute', right: 24, top: 0, bottom: 0, justifyContent: 'center' },
});
