import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader } from '../../components/AppHeader';
import { CategoryChips } from '../../components/CategoryChips';
import { SearchBar } from '../../components/SearchBar';
import { TaskItem } from '../../components/TaskItem';
import { colors, maxContentWidth, spacing, typography } from '../../theme';
import { Task } from '../../types/task';
import { compareDay } from '../../utils/date';

const ALL = 'All Task';
const CATEGORIES = [ALL, '👜 Work', 'Personal'];

// Ngày cách hôm nay `offset` ngày
function daysFromNow(offset: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date;
}

// Dữ liệu mẫu để xem giao diện (sẽ thay bằng dữ liệu lưu trên máy)
const SAMPLE_TASKS: Task[] = [
  { id: '1', title: 'Doing housework', date: daysFromNow(1), category: 'Personal', done: false },
  { id: '2', title: 'Make a studying plan', date: daysFromNow(2), category: 'Personal', done: false },
  { id: '3', title: 'Do groceries', date: daysFromNow(0), category: 'Personal', done: false },
  { id: '4', title: 'Decorate room', date: daysFromNow(0), category: 'Personal', done: false },
  { id: '5', title: 'Prepare music', date: daysFromNow(0), category: '👜 Work', done: false },
  { id: '6', title: 'Your todo task list', date: daysFromNow(-1), category: '👜 Work', done: true },
  { id: '7', title: 'Your todo task list', date: daysFromNow(-2), category: 'Personal', done: false },
];

// Màn hình chính: tìm kiếm, chip danh mục, danh sách việc theo Future / Today / Previous
export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [tasks, setTasks] = useState(SAMPLE_TASKS);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(ALL);

  // Đảo trạng thái hoàn thành
  const toggleTask = (id: string) =>
    setTasks((current) => current.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  // Lọc theo từ khóa và danh mục, rồi chia nhóm theo ngày
  const sections = useMemo(() => {
    const today = new Date();
    const text = query.trim().toLowerCase();
    const visible = tasks.filter(
      (t) => (category === ALL || t.category === category) && t.title.toLowerCase().includes(text),
    );
    return [
      { title: 'Future', items: visible.filter((t) => compareDay(t.date, today) > 0) },
      { title: 'Today task', items: visible.filter((t) => compareDay(t.date, today) === 0) },
      { title: 'Previous', items: visible.filter((t) => compareDay(t.date, today) < 0) },
    ].filter((section) => section.items.length > 0);
  }, [tasks, query, category]);

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <AppHeader />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Nội dung căn giữa, giới hạn bề rộng để đẹp trên iPad */}
        <View style={styles.content}>
          <SearchBar value={query} onChangeText={setQuery} />
          <CategoryChips categories={CATEGORIES} selected={category} onSelect={setCategory} />

          {sections.length === 0 && <Text style={styles.empty}>No tasks found</Text>}

          {sections.map((section) => (
            <View key={section.title} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              {section.items.map((task) => (
                <TaskItem key={task.id} task={task} onToggle={toggleTask} />
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.md, paddingBottom: spacing.xl + spacing.lg },
  content: { width: '100%', maxWidth: maxContentWidth, alignSelf: 'center', gap: spacing.md },
  section: { gap: spacing.sm },
  sectionTitle: { ...typography.section, color: colors.text },
  empty: { ...typography.body, color: colors.textMuted, textAlign: 'center', marginTop: spacing.xl },
});
