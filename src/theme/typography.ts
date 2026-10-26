import { TextStyle } from 'react-native';

// Kiểu chữ theo Figma (Roboto). Tạm dùng font hệ thống của iOS (San Francisco)
export const typography = {
  title: { fontSize: 24, lineHeight: 36, fontWeight: '800' },
  section: { fontSize: 18, lineHeight: 28, fontWeight: '500' },
  body: { fontSize: 16, lineHeight: 24, fontWeight: '400' },
  caption: { fontSize: 14, lineHeight: 20, fontWeight: '400' },
  tab: { fontSize: 12, lineHeight: 18, fontWeight: '400' },
} satisfies Record<string, TextStyle>;
