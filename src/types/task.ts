export type Priority = 'low' | 'medium' | 'high';

// Một việc cần làm (dueAt gồm cả ngày và giờ nhắc)
export type Task = {
  id: number;
  title: string;
  note: string;
  category: string;
  dueAt: Date;
  priority: Priority;
  notify: boolean; // có nhắc bằng thông báo không
  done: boolean;
  notificationId: string | null; // id thông báo đã hẹn giờ (để huỷ khi sửa/xoá)
};

// Dữ liệu khi tạo việc mới
export type NewTask = Pick<Task, 'title' | 'note' | 'category' | 'dueAt' | 'priority' | 'notify'>;
