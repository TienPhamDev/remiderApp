import { StyleSheet, View } from 'react-native';
import { colors } from '../theme';

// Màn hình chính (đang trống, nền theo theme)
export default function HomeScreen() {
  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
});
