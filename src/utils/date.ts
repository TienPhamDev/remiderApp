const MONTHS = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december',
];

// Định dạng ngày theo Figma, ví dụ "7,june,2023"
export function formatDate(date: Date): string {
  return `${date.getDate()},${MONTHS[date.getMonth()]},${date.getFullYear()}`;
}

// So sánh theo ngày (bỏ giờ): <0 nếu a trước b, 0 nếu cùng ngày, >0 nếu a sau b
export function compareDay(a: Date, b: Date): number {
  const dayA = new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime();
  const dayB = new Date(b.getFullYear(), b.getMonth(), b.getDate()).getTime();
  return dayA - dayB;
}

// Giờ dạng 12h, ví dụ "02:00 AM"
export function formatTime(date: Date): string {
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const suffix = hours >= 12 ? 'PM' : 'AM';
  return `${String(hours % 12 || 12).padStart(2, '0')}:${minutes} ${suffix}`;
}

const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// Tên thứ, ví dụ "Thursday"
export function formatWeekday(date: Date): string {
  return WEEKDAY_NAMES[date.getDay()];
}

// Ngày ở thanh lịch theo Figma, ví dụ "7,June,2023"
export function formatLongDate(date: Date): string {
  return `${date.getDate()},${MONTH_NAMES[date.getMonth()]},${date.getFullYear()}`;
}

// Lưới 6 tuần x 7 ngày của tháng chứa `date`, tuần bắt đầu từ thứ Hai (gồm cả ngày tháng trước/sau)
export function buildMonthGrid(date: Date): Date[] {
  const offset = (new Date(date.getFullYear(), date.getMonth(), 1).getDay() + 6) % 7; // thứ Hai = 0
  return Array.from({ length: 42 }, (_, i) => new Date(date.getFullYear(), date.getMonth(), 1 - offset + i));
}

// Chuyển sang tháng khác (delta = +1 / -1), giữ nguyên ngày nếu tháng đó đủ ngày
export function addMonths(date: Date, delta: number): Date {
  const lastDay = new Date(date.getFullYear(), date.getMonth() + delta + 1, 0).getDate();
  return new Date(date.getFullYear(), date.getMonth() + delta, Math.min(date.getDate(), lastDay));
}
