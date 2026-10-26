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
