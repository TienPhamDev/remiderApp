import * as SQLite from 'expo-sqlite';
import { NewTask, Priority, Task } from '../types/task';

// Một dòng trong bảng tasks (kiểu thô của SQLite)
type TaskRow = {
  id: number;
  title: string;
  note: string;
  category: string;
  due_at: number;
  priority: Priority;
  notify: number;
  done: number;
  notification_id: string | null;
};

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

// Mở DB một lần và tạo bảng nếu chưa có
function getDb() {
  if (!dbPromise) {
    dbPromise = (async () => {
      const db = await SQLite.openDatabaseAsync('reminder.db');
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS tasks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          note TEXT NOT NULL DEFAULT '',
          category TEXT NOT NULL,
          due_at INTEGER NOT NULL,
          priority TEXT NOT NULL,
          notify INTEGER NOT NULL DEFAULT 1,
          done INTEGER NOT NULL DEFAULT 0,
          notification_id TEXT
        );
      `);
      return db;
    })();
  }
  return dbPromise;
}

function toTask(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    note: row.note,
    category: row.category,
    dueAt: new Date(row.due_at),
    priority: row.priority,
    notify: row.notify === 1,
    done: row.done === 1,
    notificationId: row.notification_id,
  };
}

export async function listTasks(): Promise<Task[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<TaskRow>('SELECT * FROM tasks ORDER BY due_at ASC');
  return rows.map(toTask);
}

// Thêm việc mới, trả về id vừa tạo
export async function insertTask(task: NewTask): Promise<number> {
  const db = await getDb();
  const result = await db.runAsync(
    'INSERT INTO tasks (title, note, category, due_at, priority, notify) VALUES (?, ?, ?, ?, ?, ?)',
    task.title,
    task.note,
    task.category,
    task.dueAt.getTime(),
    task.priority,
    task.notify ? 1 : 0,
  );
  return result.lastInsertRowId;
}

// Ghi đè toàn bộ các cột của một việc
export async function saveTask(task: Task): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `UPDATE tasks SET title = ?, note = ?, category = ?, due_at = ?, priority = ?,
       notify = ?, done = ?, notification_id = ? WHERE id = ?`,
    task.title,
    task.note,
    task.category,
    task.dueAt.getTime(),
    task.priority,
    task.notify ? 1 : 0,
    task.done ? 1 : 0,
    task.notificationId,
    task.id,
  );
}

export async function deleteTask(id: number): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM tasks WHERE id = ?', id);
}
