import { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from 'react-native';
import { colors, maxContentWidth, radius, spacing } from '../theme';
import { Icon } from './Icon';

type Props = {
  onClose: () => void;
  children: ReactNode;
};

// Khung bottom sheet dùng chung: nền mờ (bấm để đóng), nút X nổi phía trên, thẻ chứa nội dung
export function BottomSheet({ onClose, children }: Props) {
  return (
    <View style={styles.backdrop}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Close" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.avoid}
        pointerEvents="box-none"
      >
        <View style={styles.wrap}>
          <Pressable style={styles.close} onPress={onClose} accessibilityLabel="Close">
            <Icon name="close" size={28} />
          </Pressable>
          <View style={styles.sheet}>{children}</View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: colors.overlay },
  avoid: { flex: 1, justifyContent: 'center', padding: spacing.md },
  wrap: { width: '100%', maxWidth: maxContentWidth, alignSelf: 'center', alignItems: 'center' },
  close: {
    width: 56,
    height: 56,
    marginBottom: -28,
    zIndex: 1,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.border,
  },
  sheet: {
    alignSelf: 'stretch',
    gap: spacing.md,
    padding: spacing.md,
    paddingTop: spacing.md + 28,
    borderRadius: 24,
    backgroundColor: colors.surface,
  },
});
