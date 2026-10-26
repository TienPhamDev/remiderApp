import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme';
import { Icon } from './Icon';

// Thanh trên cùng: logo "Listodo" kèm nhãn "to-do" và nút cài đặt
export function AppHeader() {
  return (
    <View style={styles.bar}>
      <View>
        <Text style={styles.logo}>Listodo</Text>
        <View style={styles.sticker}>
          <Text style={styles.stickerText}>to-do</Text>
        </View>
      </View>
      <View style={styles.settings}>
        <Icon name="setting" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: 56,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.actionBar,
  },
  logo: { ...typography.title, color: colors.text },
  sticker: {
    position: 'absolute',
    right: -34,
    top: -6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.onAccent,
    backgroundColor: colors.accent,
    transform: [{ rotate: '15deg' }],
  },
  stickerText: { fontSize: 14, color: colors.onAccent },
  settings: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
});
