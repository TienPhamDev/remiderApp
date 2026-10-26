import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors, typography } from '../theme';

// Layout gốc: Stack tối màu theo theme Listodo
export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.actionBar },
          headerTintColor: colors.text,
          headerTitleStyle: { ...typography.title, fontSize: 22 },
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Listodo' }} />
      </Stack>
    </>
  );
}
