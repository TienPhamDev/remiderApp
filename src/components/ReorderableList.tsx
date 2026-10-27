import { ReactNode, useEffect, useRef, useState } from 'react';
import { Animated, GestureResponderHandlers, PanResponder, StyleSheet, View } from 'react-native';

type Props<T> = {
  items: T[];
  keyOf: (item: T) => string | number;
  itemHeight: number; // mọi dòng cao bằng nhau để tính vị trí thả
  gap: number;
  // handleProps gắn vào phần "tay nắm" mà người dùng kéo
  renderItem: (item: T, handleProps: GestureResponderHandlers, dragging: boolean) => ReactNode;
  // Trả về false nếu lưu lỗi, danh sách sẽ quay về thứ tự cũ
  onReorder: (items: T[]) => Promise<boolean>;
};

type RowProps = {
  height: number;
  dragging: boolean;
  offset: number; // dịch chuyển để nhường chỗ cho dòng đang kéo
  dragY: Animated.Value;
  onStart: () => void;
  onMove: (dy: number) => void;
  onEnd: (dy: number) => void;
  children: (handleProps: GestureResponderHandlers) => ReactNode;
};

// Một dòng: tạo PanResponder một lần, luôn đọc props mới nhất qua ref
function Row(props: RowProps) {
  const latest = useRef(props);
  useEffect(() => {
    latest.current = props;
  });

  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false, // không để ScrollView giành lại khi đang kéo
      onPanResponderGrant: () => latest.current.onStart(),
      onPanResponderMove: (_, gesture) => latest.current.onMove(gesture.dy),
      onPanResponderRelease: (_, gesture) => latest.current.onEnd(gesture.dy),
      onPanResponderTerminate: (_, gesture) => latest.current.onEnd(gesture.dy),
    }),
  ).current;

  const { height, dragging, offset, dragY, children } = props;
  return (
    <Animated.View
      style={[{ height }, dragging ? styles.dragging : null, { transform: [{ translateY: dragging ? dragY : offset }] }]}
    >
      {children(responder.panHandlers)}
    </Animated.View>
  );
}

// Danh sách kéo thả để đổi thứ tự (dòng cao cố định). Kéo "tay nắm", thả để lưu thứ tự mới
export function ReorderableList<T>({ items, keyOf, itemHeight, gap, renderItem, onReorder }: Props<T>) {
  const step = itemHeight + gap;
  const [ordered, setOrdered] = useState(items);
  const [drag, setDrag] = useState<{ from: number; to: number } | null>(null);
  const dragRef = useRef<{ from: number; to: number } | null>(null);
  const dragY = useRef(new Animated.Value(0)).current;

  // Danh sách gốc đổi (thêm/xóa/đổi tên) thì lấy lại
  useEffect(() => {
    setOrdered(items);
  }, [items]);

  // Vị trí dòng sẽ rơi vào khi kéo lệch dy
  const targetIndex = (from: number, dy: number) =>
    Math.min(Math.max(Math.round(from + dy / step), 0), ordered.length - 1);

  const handleStart = (from: number) => {
    dragY.setValue(0);
    dragRef.current = { from, to: from };
    setDrag({ from, to: from });
  };

  const handleMove = (from: number, dy: number) => {
    const min = -from * step;
    const max = (ordered.length - 1 - from) * step;
    dragY.setValue(Math.min(Math.max(dy, min), max)); // dòng không ra khỏi danh sách
    const to = targetIndex(from, dy);
    if (dragRef.current && dragRef.current.to !== to) {
      dragRef.current = { from, to };
      setDrag({ from, to });
    }
  };

  const handleEnd = async (from: number, dy: number) => {
    if (!dragRef.current) return;
    const to = targetIndex(from, dy);
    dragRef.current = null;
    setDrag(null);
    dragY.setValue(0);
    if (to === from) return;
    const next = [...ordered];
    next.splice(to, 0, ...next.splice(from, 1));
    setOrdered(next); // hiện thứ tự mới ngay, không chờ lưu
    if (!(await onReorder(next))) setOrdered(items);
  };

  // Các dòng nằm giữa vị trí cũ và mới dịch đi một bước để nhường chỗ
  const offsetOf = (index: number) => {
    if (!drag) return 0;
    if (drag.from < drag.to && index > drag.from && index <= drag.to) return -step;
    if (drag.from > drag.to && index < drag.from && index >= drag.to) return step;
    return 0;
  };

  return (
    <View style={{ gap }}>
      {ordered.map((item, index) => (
        <Row
          key={keyOf(item)}
          height={itemHeight}
          dragging={drag?.from === index}
          offset={offsetOf(index)}
          dragY={dragY}
          onStart={() => handleStart(index)}
          onMove={(dy) => handleMove(index, dy)}
          onEnd={(dy) => handleEnd(index, dy)}
        >
          {(handleProps) => renderItem(item, handleProps, drag?.from === index)}
        </Row>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  dragging: { zIndex: 10, elevation: 10 },
});
