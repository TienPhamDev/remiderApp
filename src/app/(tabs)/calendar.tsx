import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CalendarGrid } from '../../components/CalendarGrid';
import { DateHeader } from '../../components/DateHeader';
import { TaskItem } from '../../components/TaskItem';
import { useTasks } from '../../context/TasksContext';
import { colors, maxContentWidth, spacing, typography } from '../../theme';
import { addMonths, compareDay } from '../../utils/date';

// Tab Calendar: chọn ngày trên lịch tháng, xem danh sách việc của ngày đó
export default function CalendarScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { tasks, updateTask } = useTasks();
  const [selected, setSelected] = useState(() => new Date());

  const dayTasks = tasks.filter((t) => compareDay(t.dueAt, selected) === 0);

  // Đảo trạng thái hoàn thành
  const toggleTask = (id: number) => {
    const task = tasks.find((t) => t.id === id);
    if (task) updateTask(id, { done: !task.done });
  };

  const openTask = (id: number) => router.push({ pathname: '/task/[id]', params: { id: String(id) } });

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <DateHeader
        date={selected}
        onPrevMonth={() => setSelected(addMonths(selected, -1))}
        onNextMonth={() => setSelected(addMonths(selected, 1))}
      />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Nội dung căn giữa, giới hạn bề rộng để đẹp trên iPad */}
        <View style={styles.content}>
          <CalendarGrid selected={selected} onSelect={setSelected} markedDays={tasks.map((t) => t.dueAt)} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Task</Text>
            {dayTasks.length === 0 && <Text style={styles.empty}>No tasks on this day</Text>}
            {dayTasks.map((task) => (
              <TaskItem key={task.id} task={task} onToggle={toggleTask} onPress={openTask} />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.md, paddingBottom: spacing.xl + spacing.lg },
  content: { width: '100%', maxWidth: maxContentWidth, alignSelf: 'center', gap: spacing.lg },
  section: { gap: spacing.sm },
  sectionTitle: { ...typography.section, color: colors.text },
  empty: { ...typography.body, color: colors.textMuted },
});
