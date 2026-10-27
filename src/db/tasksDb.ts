import * as SQLite from 'expo-sqlite';
import { Category } from '../types/category';
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
        CREATE TABLE IF NOT EXISTS categories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL UNIQUE COLLATE NOCASE,
          position INTEGER NOT NULL
        );
      `);
      // Lần đầu: tạo 2 danh mục mặc định (khớp với việc đã tạo trước đây)
      const count = await db.getFirstAsync<{ n: number }>('SELECT COUNT(*) AS n FROM categories');
      if (count?.n === 0) {
        await db.execAsync(`INSERT INTO categories (name, position) VALUES ('Personal', 0), ('Work', 1);`);
      }
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

export async function listCategories(): Promise<Category[]> {
  const db = await getDb();
  return db.getAllAsync<Category>('SELECT id, name FROM categories ORDER BY position ASC, id ASC');
}

// Thêm danh mục vào cuối danh sách, trả về id vừa tạo
export async function insertCategory(name: string): Promise<number> {
  const db = await getDb();
  const result = await db.runAsync(
    'INSERT INTO categories (name, position) VALUES (?, (SELECT COALESCE(MAX(position), -1) + 1 FROM categories))',
    name,
  );
  return result.lastInsertRowId;
}

// Đổi tên danh mục và đổi luôn tên trong các việc thuộc danh mục đó
export async function renameCategory(id: number, oldName: string, newName: string): Promise<void> {
  const db = await getDb();
  await db.withTransactionAsync(async () => {
    await db.runAsync('UPDATE categories SET name = ? WHERE id = ?', newName, id);
    await db.runAsync('UPDATE tasks SET category = ? WHERE category = ?', newName, oldName);
  });
}

// Xóa danh mục; các việc thuộc danh mục đó chuyển sang danh mục `fallbackName`
export async function deleteCategory(id: number, name: string, fallbackName: string): Promise<void> {
  const db = await getDb();
  await db.withTransactionAsync(async () => {
    await db.runAsync('UPDATE tasks SET category = ? WHERE category = ?', fallbackName, name);
    await db.runAsync('DELETE FROM categories WHERE id = ?', id);
  });
}
