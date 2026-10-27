import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader } from '../../components/AppHeader';
import { CategoryChips } from '../../components/CategoryChips';
import { SearchBar } from '../../components/SearchBar';
import { TaskItem } from '../../components/TaskItem';
import { useTasks } from '../../context/TasksContext';
import { colors, maxContentWidth, spacing, typography } from '../../theme';
import { compareDay } from '../../utils/date';

const ALL = 'All Task';

// Màn hình chính: tìm kiếm, chip danh mục, danh sách việc theo Future / Today / Previous
export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { tasks, categories, loading, updateTask } = useTasks();
  const [query, setQuery] = useState('');
  const [selectedCategory, setCategory] = useState(ALL);

  // Chip danh mục lấy từ tab Category. Danh mục đang chọn bị xóa/đổi tên thì quay về All Task
  const chips = [{ value: ALL, label: ALL }, ...categories.map((c) => ({ value: c.name, label: c.name }))];
  const category = chips.some((c) => c.value === selectedCategory) ? selectedCategory : ALL;

  // Đảo trạng thái hoàn thành
  const toggleTask = (id: number) => {
    const task = tasks.find((t) => t.id === id);
    if (task) updateTask(id, { done: !task.done });
  };

  const openTask = (id: number) => router.push({ pathname: '/task/[id]', params: { id: String(id) } });

  // Lọc theo từ khóa và danh mục, rồi chia nhóm theo ngày
  const sections = useMemo(() => {
    const today = new Date();
    const text = query.trim().toLowerCase();
    const visible = tasks.filter(
      (t) => (category === ALL || t.category === category) && t.title.toLowerCase().includes(text),
    );
    return [
      { title: 'Future', items: visible.filter((t) => compareDay(t.dueAt, today) > 0) },
      { title: 'Today task', items: visible.filter((t) => compareDay(t.dueAt, today) === 0) },
      { title: 'Previous', items: visible.filter((t) => compareDay(t.dueAt, today) < 0) },
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
          <CategoryChips categories={chips} selected={category} onSelect={setCategory} />

          {!loading && sections.length === 0 && (
            <Text style={styles.empty}>{tasks.length === 0 ? 'No tasks yet. Tap + to add one' : 'No tasks found'}</Text>
          )}

          {sections.map((section) => (
            <View key={section.title} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              {section.items.map((task) => (
                <TaskItem key={task.id} task={task} onToggle={toggleTask} onPress={openTask} />
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
