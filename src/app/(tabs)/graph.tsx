import { ComponentRef, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader } from '../../components/AppHeader';
import { BarChart } from '../../components/BarChart';
import { Icon } from '../../components/Icon';
import { Anchor, PopupMenu } from '../../components/PopupMenu';
import { StatCard } from '../../components/StatCard';
import { useTasks } from '../../context/TasksContext';
import { colors, maxContentWidth, radius, spacing, typography } from '../../theme';
import { compareDay, weekDays } from '../../utils/date';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const RANGES = [
  { label: 'This week', weeksAgo: 0 },
  { label: 'Last week', weeksAgo: 1 },
];

// Tab Graph: số việc đã xong mỗi ngày trong tuần (theo ngày đến hạn) và thống kê Completed / Pending
export default function GraphScreen() {
  const insets = useSafeAreaInsets();
  const { tasks } = useTasks();
  const [weeksAgo, setWeeksAgo] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(() => new Date().getDay()); // mặc định: hôm nay
  const rangeRef = useRef<ComponentRef<typeof Pressable>>(null);
  const [anchor, setAnchor] = useState<Anchor | null>(null);

  const days = weekDays(weeksAgo);
  const data = days.map((day, i) => ({
    label: DAY_LABELS[i],
    value: tasks.filter((t) => t.done && compareDay(t.dueAt, day) === 0).length,
  }));
  const inWeek = tasks.filter((t) => compareDay(t.dueAt, days[0]) >= 0 && compareDay(t.dueAt, days[6]) <= 0);
  const completed = inWeek.filter((t) => t.done).length;

  // Đo vị trí nút để đặt menu chọn tuần ngay dưới nó
  const openRanges = () => rangeRef.current?.measureInWindow((x, y, width, height) => setAnchor({ x, y, width, height }));

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <AppHeader title="Graph" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Nội dung căn giữa, giới hạn bề rộng để đẹp trên iPad */}
        <View style={styles.content}>
          <View style={styles.panel}>
            <View style={styles.panelHeader}>
              <Text style={styles.panelTitle}>Completed task</Text>
              <Pressable ref={rangeRef} style={styles.range} onPress={openRanges} accessibilityLabel="Choose week">
                <Text style={styles.rangeText}>{RANGES.find((r) => r.weeksAgo === weeksAgo)?.label}</Text>
                <Icon name="chevron-down" size={20} />
              </Pressable>
            </View>
            <BarChart data={data} selectedIndex={selectedIndex} onSelect={setSelectedIndex} />
          </View>

          <View style={styles.stats}>
            <StatCard value={completed} label="Completed Tasks" />
            <StatCard value={inWeek.length - completed} label="Pending Task" />
          </View>
        </View>
      </ScrollView>

      <PopupMenu
        anchor={anchor}
        onClose={() => setAnchor(null)}
        items={RANGES.map((range) => ({
          label: range.label,
          color: range.weeksAgo === weeksAgo ? colors.accent : undefined,
          onPress: () => setWeeksAgo(range.weeksAgo),
        }))}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.md, paddingBottom: spacing.xl + spacing.lg },
  content: { width: '100%', maxWidth: maxContentWidth, alignSelf: 'center', gap: spacing.md },
  panel: { padding: spacing.md, borderRadius: radius.card + 4, backgroundColor: colors.panel },
  panelHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  panelTitle: { ...typography.body, color: colors.text },
  range: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.tabBar,
  },
  rangeText: { ...typography.caption, lineHeight: 24, color: colors.text },
  stats: { flexDirection: 'row', gap: spacing.md },
});
