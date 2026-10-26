import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme';
import { Icon, IconName } from './Icon';

type Props = {
  icon: IconName;
  iconColor?: string;
  label: string;
  children: ReactNode; // phần giá trị bên phải
};

// Một hàng thông tin trong màn hình chi tiết: icon, nhãn, giá trị bên phải
export function InfoRow({ icon, iconColor, label, children }: Props) {
  return (
    <View style={styles.row}>
      <Icon name={icon} color={iconColor ?? colors.text} />
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: spacing.md,
    borderRadius: radius.card,
    backgroundColor: colors.surface,
  },
  label: { ...typography.body, flex: 1, color: colors.text },
});
