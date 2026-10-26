import { TextStyle } from 'react-native';

// Tên font đã đăng ký trong _layout.tsx (Roboto cho chữ thường, Playfair cho logo)
export const fonts = {
  regular: 'Roboto_400Regular',
  medium: 'Roboto_500Medium',
  logo: 'PlayfairDisplay_800ExtraBold',
} as const;

// Kiểu chữ theo Figma. Không đặt fontWeight vì mỗi độ đậm là một file font riêng
export const typography = {
  title: { fontFamily: fonts.logo, fontSize: 24, lineHeight: 36 },
  section: { fontFamily: fonts.medium, fontSize: 18, lineHeight: 28 },
  body: { fontFamily: fonts.regular, fontSize: 16, lineHeight: 24 },
  caption: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 20 },
  tab: { fontFamily: fonts.regular, fontSize: 12, lineHeight: 18 },
} satisfies Record<string, TextStyle>;
