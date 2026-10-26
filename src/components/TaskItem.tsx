import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme';
import { Task } from '../types/task';
import { formatDate } from '../utils/date';
import { Icon } from './Icon';

type Props = {
  task: Task;
  onToggle: (id: string) => void;
};

// Thẻ một việc: ô tròn hoàn thành, tiêu đề, ngày và cờ
export function TaskItem({ task, onToggle }: Props) {
  return (
    <View style={styles.card}>
      <Pressable
        onPress={() => onToggle(task.id)}
        hitSlop={8}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: task.done }}
        accessibilityLabel={task.title}
      >
        <Icon name={task.done ? 'check-circle' : 'circle'} color={task.done ? colors.primary : colors.textMuted} />
      </Pressable>
      <View style={styles.texts}>
        <Text style={[styles.title, task.done && styles.titleDone]} numberOfLines={1}>
          {task.title}
        </Text>
        <Text style={styles.date}>{formatDate(task.date)}</Text>
      </View>
      <Icon name="flag" color={colors.danger} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    minHeight: 80,
    padding: spacing.md,
    borderRadius: radius.card,
    backgroundColor: colors.card,
  },
  texts: { flex: 1 },
  title: { ...typography.body, color: colors.text },
  titleDone: { color: colors.textDone, textDecorationLine: 'line-through' },
  date: { ...typography.caption, color: colors.textMuted },
});
