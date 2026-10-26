import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform, StyleSheet, Text } from 'react-native';
import { colors, typography } from '../theme';
import { formatDate, formatTime } from '../utils/date';

type Props = {
  value: Date;
  mode: 'date' | 'time';
  onChange: (date: Date) => void;
};

// Chọn ngày hoặc giờ. iOS dùng picker dạng compact (dạng viên thuốc), nền tảng khác chỉ hiện chữ
export function DateTimePill({ value, mode, onChange }: Props) {
  if (Platform.OS === 'ios') {
    return (
      <DateTimePicker
        value={value}
        mode={mode}
        display="compact"
        themeVariant="dark"
        accentColor={colors.primary}
        onValueChange={(_event, date) => onChange(date)}
      />
    );
  }
  return <Text style={styles.text}>{mode === 'date' ? formatDate(value) : formatTime(value)}</Text>;
}

const styles = StyleSheet.create({
  text: { ...typography.caption, color: colors.text },
});
