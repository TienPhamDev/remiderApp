import { useRouter } from 'expo-router';
import { BottomTabBarProps } from 'expo-router/js-tabs';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, typography } from '../theme';
import { Icon, IconName } from './Icon';

// Icon và nhãn cho từng tab (khớp tên file trong src/app/(tabs))
const TABS: Record<string, { label: string; icon: IconName }> = {
  index: { label: 'Home', icon: 'home' },
  calendar: { label: 'Calendar', icon: 'calendar' },
  category: { label: 'Category', icon: 'category' },
  graph: { label: 'Graph', icon: 'graph' },
};

// Thanh tab dưới: 2 tab, nút + nổi ở giữa, 2 tab. Tab đang chọn có gạch vàng
export function TabBar({ state, navigateToTab, insets }: BottomTabBarProps) {
  const router = useRouter();

  const renderTab = (index: number) => {
    const route = state.routes[index];
    const tab = TABS[route.name];
    if (!tab) return null;
    const focused = state.index === index;
    return (
      <Pressable
        key={route.key}
        style={styles.tab}
        onPress={() => navigateToTab(route.key)}
        accessibilityRole="button"
        accessibilityLabel={tab.label}
      >
        <Icon name={tab.icon} color={focused ? colors.text : colors.textMuted} />
        <Text style={[styles.label, focused && styles.labelActive]}>{tab.label}</Text>
        {focused && <View style={styles.indicator} />}
      </Pressable>
    );
  };

  return (
    <View style={[styles.bar, { paddingBottom: insets.bottom }]}>
      {renderTab(0)}
      {renderTab(1)}
      <View style={styles.fabSlot}>
        <Pressable style={styles.fab} onPress={() => router.push('/create')} accessibilityLabel="Add task">
          <Icon name="add" size={32} />
        </Pressable>
      </View>
      {renderTab(2)}
      {renderTab(3)}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    minHeight: 56,
    borderTopWidth: 1,
    borderTopColor: colors.card,
    backgroundColor: colors.tabBar,
  },
  tab: { flex: 1, height: 56, alignItems: 'center', justifyContent: 'center', paddingTop: 2 },
  label: { ...typography.tab, color: colors.textMuted },
  labelActive: { color: colors.text },
  indicator: {
    position: 'absolute',
    bottom: 0,
    width: 51,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.accent,
  },
  fabSlot: { flex: 1, alignItems: 'center' },
  fab: {
    width: 56,
    height: 56,
    marginTop: -28,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.primaryDark,
  },
});
