import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ConfirmDeleteModal } from '../../components/ConfirmDeleteModal';
import { DateTimePill } from '../../components/DateTimePill';
import { Icon } from '../../components/Icon';
import { InfoRow } from '../../components/InfoRow';
import { ValuePill } from '../../components/ValuePill';
import {
  CATEGORIES,
  CATEGORY_LABELS,
  nextOf,
  PRIORITIES,
  PRIORITY_COLORS,
  PRIORITY_LABELS,
} from '../../constants/task';
import { useTasks } from '../../context/TasksContext';
import { colors, maxContentWidth, radius, spacing, typography } from '../../theme';

// Chi tiết một việc: sửa tiêu đề, ghi chú, danh mục, ngày giờ, ưu tiên, nhắc; xóa việc
export default function TaskInfoScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { tasks, updateTask, removeTask } = useTasks();
  const task = tasks.find((t) => t.id === Number(id));

  // Tiêu đề và ghi chú sửa trên bản nháp, lưu khi rời ô nhập
  const [title, setTitle] = useState(task?.title ?? '');
  const [note, setNote] = useState(task?.note ?? '');
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Việc đã bị xóa hoặc id sai: quay lại
  if (!task) {
    return (
      <View style={[styles.screen, styles.center]}>
        <Text style={styles.empty}>Task not found</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.link}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  // Lưu tiêu đề (không cho rỗng) và ghi chú
  const saveTexts = () => {
    const trimmed = title.trim();
    if (!trimmed) setTitle(task.title);
    if ((trimmed || task.title) !== task.title || note !== task.note) {
      updateTask(task.id, { title: trimmed || task.title, note });
    }
  };

  const goBack = () => {
    saveTexts();
    router.back();
  };

  // Đổi ngày giữ nguyên giờ, và ngược lại
  const setDay = (day: Date) => {
    const next = new Date(task.dueAt);
    next.setFullYear(day.getFullYear(), day.getMonth(), day.getDate());
    updateTask(task.id, { dueAt: next });
  };
  const setHour = (time: Date) => {
    const next = new Date(task.dueAt);
    next.setHours(time.getHours(), time.getMinutes(), 0, 0);
    updateTask(task.id, { dueAt: next });
  };

  const confirmRemove = async () => {
    setConfirmDelete(false);
    if (await removeTask(task.id)) router.back(); // lỗi thì ở lại màn hình này
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        <View style={styles.topBar}>
          <Pressable style={[styles.roundButton, styles.back]} onPress={goBack} accessibilityLabel="Back">
            <Icon name="chevron-left" />
          </Pressable>
          <Pressable
            style={[styles.roundButton, styles.trash]}
            onPress={() => setConfirmDelete(true)}
            accessibilityLabel="Delete task"
          >
            <Icon name="trash" color={colors.danger} />
          </Pressable>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + spacing.md }]}
          keyboardShouldPersistTaps="handled"
        >
          <TextInput
            style={styles.title}
            value={title}
            onChangeText={setTitle}
            onBlur={saveTexts}
            multiline
            placeholder="Task title"
            placeholderTextColor={colors.placeholder}
          />

          <View style={styles.rows}>
            <InfoRow icon="category" label="Category">
              <ValuePill
                text={CATEGORY_LABELS[task.category] ?? task.category}
                onPress={() => updateTask(task.id, { category: nextOf(CATEGORIES, task.category) })}
              />
            </InfoRow>
            <InfoRow icon="calendar" label="Due Date">
              <DateTimePill value={task.dueAt} mode="date" onChange={setDay} />
            </InfoRow>
            <InfoRow icon="clock" label="Time">
              <DateTimePill value={task.dueAt} mode="time" onChange={setHour} />
            </InfoRow>
            <InfoRow icon="flag" iconColor={PRIORITY_COLORS[task.priority]} label="Priority">
              <ValuePill
                text={PRIORITY_LABELS[task.priority]}
                onPress={() => updateTask(task.id, { priority: nextOf(PRIORITIES, task.priority) })}
              />
            </InfoRow>
            <InfoRow icon="bell" label="Notify me">
              <Switch
                value={task.notify}
                onValueChange={(notify) => {
                  updateTask(task.id, { notify });
                }}
                trackColor={{ true: colors.primary, false: colors.border }}
                thumbColor={colors.text}
              />
            </InfoRow>
          </View>

          <TextInput
            style={styles.note}
            value={note}
            onChangeText={setNote}
            onBlur={saveTexts}
            multiline
            placeholder="Add a note..."
            placeholderTextColor={colors.placeholder}
          />
        </ScrollView>
      </View>

      <ConfirmDeleteModal visible={confirmDelete} onCancel={() => setConfirmDelete(false)} onConfirm={confirmRemove} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  center: { alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  empty: { ...typography.body, color: colors.textMuted },
  link: { ...typography.body, color: colors.primary },
  content: { flex: 1, width: '100%', maxWidth: maxContentWidth, alignSelf: 'center' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', padding: spacing.md },
  roundButton: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  back: { borderWidth: 1, borderColor: colors.border },
  trash: { backgroundColor: colors.dangerSoft },
  scroll: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'space-between', gap: spacing.lg, paddingHorizontal: spacing.md },
  title: { ...typography.body, fontSize: 24, lineHeight: 32, color: colors.text, padding: 0 },
  rows: { gap: spacing.sm },
  note: { ...typography.caption, color: colors.textMuted, textAlign: 'center', padding: 0 },
});
