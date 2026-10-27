// Màu lấy từ Figma "Listodo - Todo List App UI Kit" (giao diện tối)
export const colors = {
  // Nền
  background: '#0B011A', // nền màn hình
  actionBar: '#0E0E0E', // thanh tiêu đề
  tabBar: '#181818', // thanh tab dưới
  card: '#202020', // thẻ nhắc việc
  surface: '#292929', // ô nhập, bề mặt phụ

  // Viền
  border: '#3A3A3A',
  dayBorder: '#4F4F4F', // viền ô ngày trên lịch

  // Màu nhấn
  primary: '#9B60F7', // tím: nút chính, nút Search
  primaryDark: '#7633DF',
  accent: '#F8CD7A', // vàng: chip đang chọn, tab đang chọn
  onAccent: '#101010', // chữ trên nền vàng

  // Chữ
  text: '#FFFFFF',
  textMuted: '#616161', // ngày, nhãn phụ
  textDone: '#7B7B7B', // việc đã hoàn thành (gạch ngang)

  // Biểu đồ
  panel: '#1E1E1E', // thẻ biểu đồ và ô thống kê
  bar: '#F3EBFE',
  barActive: '#AB7AF8',

  // Ô nhập, lớp phủ, độ ưu tiên
  input: '#191919',
  placeholder: '#4F4F4F',
  overlay: 'rgba(0, 0, 0, 0.8)',
  priorityLow: '#3DDC6B',
  priorityMedium: '#F8CD7A',
  priorityHigh: '#FF5959',

  // Trạng thái
  danger: '#FF5959', // cờ ưu tiên, xóa
  dangerSoft: 'rgba(255, 89, 89, 0.15)', // nền khi vuốt để xóa
} as const;
