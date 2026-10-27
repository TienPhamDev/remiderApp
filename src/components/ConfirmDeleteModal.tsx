import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radius, spacing, typography } from '../theme';
import { Icon } from './Icon';

type Props = {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  message?: string;
};

// Hộp thoại xác nhận xóa việc
export function ConfirmDeleteModal({ visible, onCancel, onConfirm, message }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={styles.dialog}>
          <View style={styles.iconBox}>
            <Icon name="trash" size={32} color={colors.danger} />
          </View>
          <Text style={styles.title}>Are You Sure?</Text>
          <Text style={styles.message}>
            {message ?? "Do you really want to delete this task?\nthis process can't be undone."}
          </Text>
          <View style={styles.buttons}>
            <Pressable style={[styles.button, styles.cancel]} onPress={onCancel}>
              <Text style={styles.buttonText}>Cancel</Text>
            </Pressable>
            <Pressable style={[styles.button, styles.delete]} onPress={onConfirm}>
              <Text style={styles.buttonText}>Delete</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    backgroundColor: colors.overlay,
  },
  dialog: {
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    gap: 12,
    padding: spacing.md,
    borderRadius: 24,
    backgroundColor: colors.card,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: radius.card,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.dangerSoft,
  },
  title: { ...typography.section, color: colors.text },
  message: { ...typography.caption, color: colors.textMuted, textAlign: 'center' },
  buttons: { flexDirection: 'row', gap: 12, alignSelf: 'stretch', marginTop: spacing.sm },
  button: { flex: 1, height: 40, borderRadius: radius.card, alignItems: 'center', justifyContent: 'center' },
  cancel: { borderWidth: 1, borderColor: colors.textMuted },
  delete: { backgroundColor: colors.danger },
  buttonText: { ...typography.caption, fontFamily: fonts.medium, color: colors.text },
});
