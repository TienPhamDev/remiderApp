// Khoảng cách và bo góc theo Figma (đơn vị dp)
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16, // lề màn hình
  lg: 24,
  xl: 32,
} as const;

export const radius = {
  card: 16,
  chip: 39,
  pill: 20,
  full: 999,
} as const;

// Chiều rộng tối đa của nội dung, để iPad không bị kéo giãn quá rộng
export const maxContentWidth = 640;
