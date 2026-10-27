import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import {
  deleteCategory,
  deleteTask,
  insertCategory,
  insertTask,
  listCategories,
  listTasks,
  renameCategory as renameCategoryInDb,
  saveCategoryOrder,
  saveTask,
} from '../db/tasksDb';
import { Category } from '../types/category';
import { NewTask, Task } from '../types/task';
import { cancelTaskNotification, scheduleTaskNotification } from '../utils/notifications';

type TaskPatch = Partial<Omit<Task, 'id' | 'notificationId'>>;

// Các hàm ghi trả về true nếu thành công, false nếu lỗi (đã báo cho người dùng)
type TasksContextValue = {
  tasks: Task[];
  categories: Category[];
  loading: boolean;
  addTask: (task: NewTask) => Promise<boolean>;
  updateTask: (id: number, patch: TaskPatch) => Promise<boolean>;
  removeTask: (id: number) => Promise<boolean>;
  addCategory: (name: string) => Promise<boolean>;
  renameCategory: (id: number, name: string) => Promise<boolean>;
  removeCategory: (id: number) => Promise<boolean>;
  reorderCategories: (ids: number[]) => Promise<boolean>;
};

const TasksContext = createContext<TasksContextValue | null>(null);

const byDueAt = (a: Task, b: Task) => a.dueAt.getTime() - b.dueAt.getTime();

// Giữ danh sách việc và danh mục trong bộ nhớ, đồng bộ với SQLite và thông báo
export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const tasksRef = useRef<Task[]>([]); // bản mới nhất, để đọc trong hàm async
  const categoriesRef = useRef<Category[]>([]);
  const queueRef = useRef<Promise<unknown>>(Promise.resolve());

  const setAll = (next: Task[]) => {
    tasksRef.current = next;
    setTasks(next);
  };

  const setAllCategories = (next: Category[]) => {
    categoriesRef.current = next;
    setCategories(next);
  };

  // Xếp hàng: các thao tác chạy lần lượt, thao tác sau luôn thấy kết quả của thao tác trước.
  // Lỗi được báo cho người dùng và trả về false, nên hàng đợi không bao giờ bị kẹt
  const enqueue = (action: () => Promise<void>, errorMessage: string): Promise<boolean> => {
    const run = queueRef.current.then(action).then(
      () => true,
      (error) => {
        console.warn(error);
        Alert.alert('Something went wrong', errorMessage);
        return false;
      },
    );
    queueRef.current = run;
    return run;
  };

  // Nạp dữ liệu từ máy khi mở app
  useEffect(() => {
    enqueue(async () => {
      setAllCategories(await listCategories());
      setAll(await listTasks());
    }, 'Could not load your tasks.').finally(() => setLoading(false));
  }, []);

  const addTask = (draft: NewTask) =>
    enqueue(async () => {
      const id = await insertTask(draft);
      const task: Task = { ...draft, id, done: false, notificationId: null };
      try {
        task.notificationId = await scheduleTaskNotification(task);
        if (task.notificationId) await saveTask(task);
      } catch (error) {
        // Ghi DB lỗi thì hoàn tác để không còn việc hay thông báo mồ côi
        await cancelTaskNotification(task.notificationId);
        await deleteTask(id).catch(() => {});
        throw error;
      }
      setAll([...tasksRef.current, task].sort(byDueAt));
    }, 'Could not add the task. Please try again.');

  const updateTask = (id: number, patch: TaskPatch) =>
    enqueue(async () => {
      const current = tasksRef.current.find((t) => t.id === id);
      if (!current) return;
      const next: Task = { ...current, ...patch };
      // Đổi giờ/nội dung/hoàn thành thì hẹn thông báo mới, ghi DB xong mới hủy thông báo cũ
      next.notificationId = await scheduleTaskNotification(next);
      try {
        await saveTask(next);
      } catch (error) {
        await cancelTaskNotification(next.notificationId); // giữ nguyên thông báo cũ
        throw error;
      }
      await cancelTaskNotification(current.notificationId);
      setAll(tasksRef.current.map((t) => (t.id === id ? next : t)).sort(byDueAt));
    }, 'Could not save your changes. Please try again.');

  const removeTask = (id: number) =>
    enqueue(async () => {
      const current = tasksRef.current.find((t) => t.id === id);
      await deleteTask(id); // xóa DB trước: lỗi thì thông báo vẫn còn nguyên
      await cancelTaskNotification(current?.notificationId ?? null);
      setAll(tasksRef.current.filter((t) => t.id !== id));
    }, 'Could not delete the task. Please try again.');

  const addCategory = (name: string) =>
    enqueue(async () => {
      const id = await insertCategory(name);
      setAllCategories([...categoriesRef.current, { id, name }]);
    }, 'Could not add the category. Please try again.');

  // Đổi tên / xóa danh mục làm đổi cả các việc thuộc danh mục đó, nên nạp lại danh sách việc
  const renameCategory = (id: number, name: string) =>
    enqueue(async () => {
      const current = categoriesRef.current.find((c) => c.id === id);
      if (!current || current.name === name) return;
      await renameCategoryInDb(id, current.name, name);
      setAllCategories(categoriesRef.current.map((c) => (c.id === id ? { ...c, name } : c)));
      setAll(await listTasks());
    }, 'Could not rename the category. Please try again.');

  const removeCategory = (id: number) =>
    enqueue(async () => {
      const current = categoriesRef.current.find((c) => c.id === id);
      const fallback = categoriesRef.current.find((c) => c.id !== id); // việc chuyển sang danh mục khác
      if (!current || !fallback) throw new Error('Cannot delete the last category');
      await deleteCategory(id, current.name, fallback.name);
      setAllCategories(categoriesRef.current.filter((c) => c.id !== id));
      setAll(await listTasks());
    }, 'Could not delete the category. Please try again.');

  // ids là thứ tự mới của toàn bộ danh mục
  const reorderCategories = (ids: number[]) =>
    enqueue(async () => {
      const byId = new Map(categoriesRef.current.map((c) => [c.id, c]));
      const next = ids.map((id) => byId.get(id)).filter((c): c is Category => c !== undefined);
      if (next.length !== categoriesRef.current.length) throw new Error('Invalid category order');
      await saveCategoryOrder(ids);
      setAllCategories(next);
    }, 'Could not save the new order. Please try again.');

  return (
    <TasksContext.Provider
      value={{
        tasks,
        categories,
        loading,
        addTask,
        updateTask,
        removeTask,
        addCategory,
        renameCategory,
        removeCategory,
        reorderCategories,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const value = useContext(TasksContext);
  if (!value) throw new Error('useTasks phải nằm trong TasksProvider');
  return value;
}
