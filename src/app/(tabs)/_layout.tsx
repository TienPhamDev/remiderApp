import { Tabs } from 'expo-router/js-tabs';
import { TabBar } from '../../components/TabBar';

// 4 tab: Home, Calendar, Category, Graph (nút + nằm giữa trong TabBar)
export default function TabsLayout() {
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="calendar" />
      <Tabs.Screen name="category" />
      <Tabs.Screen name="graph" />
    </Tabs>
  );
}
