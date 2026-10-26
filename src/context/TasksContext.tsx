import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { deleteTask, insertTask, listTasks, saveTask } from '../db/tasksDb';
import { NewTask, Task } from '../types/task';
import { cancelTaskNotification, scheduleTaskNotification } from '../utils/notifications';

type TaskPatch = Partial<Omit<Task, 'id' | 'notificationId'>>;

type TasksContextValue = {
  tasks: Task[];
  loading: boolean;
  addTask: (task: NewTask) => Promise<void>;
  updateTask: (id: number, patch: TaskPatch) => Promise<void>;
  removeTask: (id: number) => Promise<void>;
};

const TasksContext = createContext<TasksContextValue | null>(null);

// Giữ danh sách việc trong bộ nhớ, đồng bộ với SQLite và thông báo
export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const tasksRef = useRef<Task[]>([]); // bản mới nhất, để đọc trong hàm async

  const setAll = (next: Task[]) => {
    tasksRef.current = next;
    setTasks(next);
  };

  // Nạp dữ liệu từ máy khi mở app
  useEffect(() => {
    listTasks()
      .then(setAll)
      .finally(() => setLoading(false));
  }, []);

  const addTask = async (draft: NewTask) => {
    const id = await insertTask(draft);
    const task: Task = { ...draft, id, done: false, notificationId: null };
    task.notificationId = await scheduleTaskNotification(task);
    if (task.notificationId) await saveTask(task);
    setAll([...tasksRef.current, task].sort((a, b) => a.dueAt.getTime() - b.dueAt.getTime()));
  };

  const updateTask = async (id: number, patch: TaskPatch) => {
    const current = tasksRef.current.find((t) => t.id === id);
    if (!current) return;
    const next: Task = { ...current, ...patch };
    // Đổi giờ/nội dung/hoàn thành thì hẹn lại thông báo
    await cancelTaskNotification(current.notificationId);
    next.notificationId = await scheduleTaskNotification(next);
    await saveTask(next);
    setAll(
      tasksRef.current.map((t) => (t.id === id ? next : t)).sort((a, b) => a.dueAt.getTime() - b.dueAt.getTime()),
    );
  };

  const removeTask = async (id: number) => {
    const current = tasksRef.current.find((t) => t.id === id);
    if (current) await cancelTaskNotification(current.notificationId);
    await deleteTask(id);
    setAll(tasksRef.current.filter((t) => t.id !== id));
  };

  return (
    <TasksContext.Provider value={{ tasks, loading, addTask, updateTask, removeTask }}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const value = useContext(TasksContext);
  if (!value) throw new Error('useTasks phải nằm trong TasksProvider');
  return value;
}
