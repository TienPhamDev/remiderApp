import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, typography } from '../theme';

export type BarDatum = { label: string; value: number };

type Props = {
  data: BarDatum[];
  selectedIndex: number;
  onSelect: (index: number) => void;
};

const PLOT_HEIGHT = 164; // chiều cao vùng vẽ (từ đường 0 lên đỉnh trục)
const BAR_WIDTH = 28;
const AXIS_WIDTH = 22;
const TOOLTIP_SPACE = 40;

// Chọn mốc trục tung: bước 2 khi nhỏ, tối đa 5 khoảng (ví dụ 00, 02, ... 10)
function axisScale(maxValue: number) {
  let top = Math.max(4, Math.ceil(maxValue / 2) * 2);
  let step = 2;
  if (top > 10) {
    step = Math.ceil(top / 5);
    top = step * 5;
  }
  return { top, ticks: Array.from({ length: top / step + 1 }, (_, i) => i * step) };
}

const pad = (n: number) => String(n).padStart(2, '0');

// Biểu đồ cột: trục tung có đường kẻ, cột được chọn tô tím kèm chú thích số việc
export function BarChart({ data, selectedIndex, onSelect }: Props) {
  const { top, ticks } = axisScale(Math.max(0, ...data.map((d) => d.value)));
  const yOf = (value: number) => (value / top) * PLOT_HEIGHT; // chiều cao tương ứng với giá trị

  return (
    <View>
      <View style={styles.chart}>
        {/* Trục tung: nhãn nằm giữa theo đường kẻ */}
        <View style={styles.axis}>
          {ticks.map((tick) => (
            <Text key={tick} style={[styles.axisLabel, { bottom: yOf(tick) - 9 }]}>
              {pad(tick)}
            </Text>
          ))}
        </View>

        <View style={styles.plot}>
          {ticks.map((tick) => (
            <View key={tick} style={[styles.gridLine, tick === 0 && styles.baseline, { bottom: yOf(tick) }]} />
          ))}

          <View style={styles.bars}>
            {data.map((item, index) => {
              const selected = index === selectedIndex;
              const height = yOf(item.value);
              return (
                <Pressable
                  key={item.label}
                  style={styles.column}
                  onPress={() => onSelect(index)}
                  accessibilityLabel={`${item.label}: ${item.value} task`}
                  accessibilityState={{ selected }}
                >
                  {selected && (
                    <View style={[styles.tooltipWrap, { bottom: height + 8 }]} pointerEvents="none">
                      <View style={styles.tooltip}>
                        <Text style={styles.tooltipText}>{pad(item.value)} Task</Text>
                      </View>
                    </View>
                  )}
                  <View style={[styles.bar, selected && styles.barActive, { height }]}>
                    {selected && item.value > 0 && <View style={styles.ring} />}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>

      <View style={styles.labels}>
        {data.map((item) => (
          <Text key={item.label} style={styles.label}>
            {item.label}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chart: { flexDirection: 'row', height: PLOT_HEIGHT + TOOLTIP_SPACE, paddingTop: TOOLTIP_SPACE }, // chừa chỗ cho chú thích phía trên
  axis: { width: AXIS_WIDTH },
  axisLabel: { ...typography.tab, position: 'absolute', left: 0, color: colors.text },
  plot: { flex: 1, height: PLOT_HEIGHT },
  gridLine: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: colors.surface },
  baseline: { backgroundColor: colors.border },
  bars: { ...StyleSheet.absoluteFill, flexDirection: 'row' },
  column: { flex: 1, height: '100%', alignItems: 'center', justifyContent: 'flex-end' },
  bar: { width: BAR_WIDTH, borderTopLeftRadius: 6, borderTopRightRadius: 6, backgroundColor: colors.bar },
  barActive: { backgroundColor: colors.barActive, alignItems: 'center' },
  ring: { marginTop: 8, width: 8, height: 8, borderRadius: 4, borderWidth: 1.5, borderColor: colors.text },
  // Khung rộng hơn cột để chú thích không bị xuống dòng
  tooltipWrap: { position: 'absolute', zIndex: 1, width: 96, alignItems: 'center' },
  tooltip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: colors.text,
  },
  tooltipText: { ...typography.tab, color: '#000', textAlign: 'center' },
  labels: { flexDirection: 'row', marginLeft: AXIS_WIDTH, marginTop: 8 },
  label: { ...typography.tab, flex: 1, textAlign: 'center', color: colors.text },
});
