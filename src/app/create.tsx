import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { DateTimePill } from '../components/DateTimePill';
import { Icon } from '../components/Icon';
import { CATEGORIES, CATEGORY_LABELS, nextOf, PRIORITIES, PRIORITY_COLORS } from '../constants/task';
import { useTasks } from '../context/TasksContext';
import { colors, fonts, maxContentWidth, radius, spacing, typography } from '../theme';
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
  const { addTask } = useTasks();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [priority, setPriority] = useState<Priority>('low');
  const [dueAt, setDueAt] = useState(defaultDueAt);
  const [showDate, setShowDate] = useState(false);
  const [saving, setSaving] = useState(false);

  const canAdd = title.trim().length > 0 && !saving;

  const submit = async () => {
    if (!canAdd) return;
    setSaving(true);
    try {
      await addTask({ title: title.trim(), note: '', category, dueAt, priority, notify: true });
      router.back();
    } finally {
      setSaving(false); // lỗi lưu thì cho bấm lại
    }
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
    <View style={styles.backdrop}>
      {/* Bấm ra ngoài để đóng */}
      <Pressable style={StyleSheet.absoluteFill} onPress={() => router.back()} accessibilityLabel="Close" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.avoid} pointerEvents="box-none">
        <View style={styles.wrap}>
          <Pressable style={styles.close} onPress={() => router.back()} accessibilityLabel="Close">
            <Icon name="close" size={28} />
          </Pressable>
          <View style={styles.sheet}>
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
              <Pressable style={styles.category} onPress={() => setCategory(nextOf(CATEGORIES, category))}>
                <Text style={styles.categoryText}>{CATEGORY_LABELS[category]}</Text>
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
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: colors.overlay },
  avoid: { flex: 1, justifyContent: 'center', padding: spacing.md },
  wrap: { width: '100%', maxWidth: maxContentWidth, alignSelf: 'center', alignItems: 'center' },
  close: {
    width: 56,
    height: 56,
    marginBottom: -28,
    zIndex: 1,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.border,
  },
  sheet: {
    alignSelf: 'stretch',
    gap: spacing.md,
    padding: spacing.md,
    paddingTop: spacing.md + 28,
    borderRadius: 24,
    backgroundColor: colors.surface,
  },
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    borderRadius: radius.pill,
    backgroundColor: colors.input,
  },
  categoryText: { ...typography.caption, lineHeight: 24, color: colors.text },
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
