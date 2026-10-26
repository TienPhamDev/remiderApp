import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radius, spacing, typography } from '../theme';
import { buildMonthGrid, compareDay, formatDate } from '../utils/date';

type Props = {
  selected: Date;
  onSelect: (date: Date) => void;
  markedDays: Date[]; // những ngày có việc, hiện chấm vàng
};

// Chữ cái thứ, bắt đầu từ thứ Hai (khớp getDay() 1..6 rồi 0)
const WEEKDAY_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

// Lịch tháng: hàng thứ (thứ đang chọn màu vàng) và lưới 6 tuần
export function CalendarGrid({ selected, onSelect, markedDays }: Props) {
  const days = buildMonthGrid(selected);
  const selectedWeekday = (selected.getDay() + 6) % 7;

  return (
    <View style={styles.grid}>
      <View style={styles.row}>
        {WEEKDAY_LETTERS.map((letter, index) => (
          <View key={index} style={[styles.cell, styles.weekdayCell, index === selectedWeekday && styles.weekdayActive]}>
            <Text style={styles.weekdayText}>{letter}</Text>
          </View>
        ))}
      </View>

      {Array.from({ length: 6 }, (_, week) => (
        <View key={week} style={styles.row}>
          {days.slice(week * 7, week * 7 + 7).map((day) => {
            const inMonth = day.getMonth() === selected.getMonth();
            const isSelected = compareDay(day, selected) === 0;
            const hasTask = markedDays.some((d) => compareDay(d, day) === 0);
            return (
              <Pressable
                key={day.getTime()}
                style={[styles.cell, styles.dayCell, isSelected && styles.daySelected, !inMonth && styles.dayOutside]}
                onPress={() => onSelect(day)}
                accessibilityLabel={formatDate(day)}
                accessibilityState={{ selected: isSelected }}
              >
                <Text style={styles.dayText}>{day.getDate()}</Text>
                {hasTask && <View style={styles.dot} />}
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { gap: spacing.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  cell: { width: 40, height: 40, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' },
  weekdayCell: { backgroundColor: colors.text },
  weekdayActive: { backgroundColor: colors.accent },
  weekdayText: { ...typography.body, fontFamily: fonts.medium, color: colors.onAccent },
  dayCell: { borderWidth: 1, borderColor: colors.dayBorder },
  daySelected: { borderColor: colors.text },
  dayOutside: { opacity: 0.34 },
  dayText: { ...typography.body, color: colors.text },
  dot: { position: 'absolute', bottom: 5, width: 4, height: 4, borderRadius: 2, backgroundColor: colors.accent },
});
