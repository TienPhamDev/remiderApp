import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Task } from '../types/task';

// Khi app đang mở, vẫn hiện banner thông báo
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Xin quyền gửi thông báo (hỏi người dùng nếu chưa từng hỏi)
async function ensurePermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  if (!current.canAskAgain) return false;
  const asked = await Notifications.requestPermissionsAsync();
  return asked.granted;
}

// Hẹn giờ thông báo cho một việc, trả về id thông báo (null nếu không cần/không thể hẹn)
export async function scheduleTaskNotification(task: Task): Promise<string | null> {
  if (Platform.OS === 'web') return null; // web không hỗ trợ thông báo cục bộ
  if (!task.notify || task.done || task.dueAt.getTime() <= Date.now()) return null;
  try {
    if (!(await ensurePermission())) return null;
    return await Notifications.scheduleNotificationAsync({
      content: { title: task.title, body: task.note || 'Đến giờ rồi!' },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: task.dueAt },
    });
  } catch {
    return null; // lỗi thông báo không được làm hỏng việc lưu dữ liệu
  }
}

export async function cancelTaskNotification(notificationId: string | null): Promise<void> {
  if (!notificationId || Platform.OS === 'web') return;
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch {
    // thông báo có thể đã được gửi xong, bỏ qua
  }
}
