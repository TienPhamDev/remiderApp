import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { BottomSheet } from '../components/BottomSheet';
import { DateTimePill } from '../components/DateTimePill';
import { Icon } from '../components/Icon';
import { nextOf, PRIORITIES, PRIORITY_COLORS } from '../constants/task';
import { useTasks } from '../context/TasksContext';
import { colors, fonts, radius, spacing, typography } from '../theme';
import { Priority } from '../types/task';

// Giờ mặc định cho việc mới: đầu giờ kế tiếp
function defaultDueAt(): Date {
  const date = new Date();
  date.setHours(date.getHours() + 1, 0, 0, 0);
  return date;
}

// Bottom sheet tạo việc mới: nội dung, danh mục, ưu tiên, ngày giờ
export default function CreateTaskScreen() {
  const router = useRouter();
  const { addTask, categories } = useTasks();
  const names = categories.map((c) => c.name);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(names[0] ?? '');
  const [priority, setPriority] = useState<Priority>('low');
  const [dueAt, setDueAt] = useState(defaultDueAt);
  const [showDate, setShowDate] = useState(false);
  const [saving, setSaving] = useState(false);

  const canAdd = title.trim().length > 0 && category !== '' && !saving;

  const submit = async () => {
    if (!canAdd) return;
    setSaving(true);
    const ok = await addTask({ title: title.trim(), note: '', category, dueAt, priority, notify: true });
    if (ok) router.back();
    else setSaving(false); // lỗi lưu thì giữ sheet mở và cho bấm lại
  };

  // Đổi ngày giữ nguyên giờ, và ngược lại
  const setDay = (day: Date) => {
    const next = new Date(dueAt);
    next.setFullYear(day.getFullYear(), day.getMonth(), day.getDate());
    setDueAt(next);
  };
  const setHour = (time: Date) => {
    const next = new Date(dueAt);
    next.setHours(time.getHours(), time.getMinutes(), 0, 0);
    setDueAt(next);
  };

  return (
    <BottomSheet onClose={() => router.back()}>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Input new task here..."
        placeholderTextColor={colors.placeholder}
        multiline
        autoFocus
      />

      <View style={styles.options}>
        <Pressable style={styles.category} onPress={() => setCategory(nextOf(names, category))}>
          <Text style={styles.categoryText} numberOfLines={1}>
            {category}
          </Text>
          <Icon name="chevron-down" size={20} />
        </Pressable>
        <Pressable
          style={styles.circle}
          onPress={() => setPriority(nextOf(PRIORITIES, priority))}
          accessibilityLabel={`Priority ${priority}`}
        >
          <Icon name="flag" color={PRIORITY_COLORS[priority]} />
        </Pressable>
        <Pressable style={styles.circle} onPress={() => setShowDate(!showDate)} accessibilityLabel="Due date">
          <Icon name="calendar" />
        </Pressable>
      </View>

      {showDate && (
        <View style={styles.dateRow}>
          <DateTimePill value={dueAt} mode="date" onChange={setDay} />
          <DateTimePill value={dueAt} mode="time" onChange={setHour} />
        </View>
      )}

      <Pressable style={[styles.add, !canAdd && styles.addDisabled]} onPress={submit} disabled={!canAdd}>
        <Text style={styles.addText}>Add New task</Text>
      </Pressable>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  input: {
    ...typography.caption,
    height: 112,
    padding: 16,
    paddingTop: 16,
    borderRadius: radius.card,
    backgroundColor: colors.input,
    color: colors.text,
    textAlignVertical: 'top',
  },
  options: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  category: {
    height: 40,
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    borderRadius: radius.pill,
    backgroundColor: colors.input,
  },
  categoryText: { ...typography.caption, lineHeight: 24, color: colors.text, flexShrink: 1 },
  circle: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.input,
  },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  add: { height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary },
  addDisabled: { opacity: 0.5 },
  addText: { ...typography.body, fontFamily: fonts.medium, color: colors.text },
});
