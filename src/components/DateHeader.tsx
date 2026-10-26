import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme';
import { formatLongDate, formatWeekday } from '../utils/date';
import { Icon } from './Icon';

type Props = {
  date: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
};

// Thanh trên của lịch: thứ + ngày đang chọn, hai nút chuyển tháng
export function DateHeader({ date, onPrevMonth, onNextMonth }: Props) {
  return (
    <View style={styles.bar}>
      <View>
        <Text style={styles.weekday}>{formatWeekday(date)}</Text>
        <Text style={styles.date}>{formatLongDate(date)}</Text>
      </View>
      <View style={styles.buttons}>
        <Pressable style={styles.button} onPress={onPrevMonth} accessibilityLabel="Previous month">
          <Icon name="chevron-left" />
        </Pressable>
        <Pressable style={styles.button} onPress={onNextMonth} accessibilityLabel="Next month">
          <Icon name="chevron-right" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    minHeight: 56,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.actionBar,
  },
  weekday: { ...typography.caption, color: colors.textMuted },
  date: { ...typography.section, color: colors.text },
  buttons: { flexDirection: 'row', gap: 12 },
  button: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.text,
  },
});
