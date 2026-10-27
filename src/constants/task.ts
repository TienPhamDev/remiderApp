import { colors } from '../theme';
import { Priority } from '../types/task';

// Thứ tự độ ưu tiên khi bấm đổi, kèm nhãn và màu cờ
export const PRIORITIES: Priority[] = ['low', 'medium', 'high'];
export const PRIORITY_LABELS: Record<Priority, string> = { low: 'Low', medium: 'Medium', high: 'High' };
export const PRIORITY_COLORS: Record<Priority, string> = {
  low: colors.priorityLow,
  medium: colors.priorityMedium,
  high: colors.priorityHigh,
};

// Lấy phần tử kế tiếp trong danh sách (quay vòng)
export function nextOf<T>(list: T[], current: T): T {
  return list[(list.indexOf(current) + 1) % list.length];
}
