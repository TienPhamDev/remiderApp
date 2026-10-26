import { Stack } from 'expo-router';

// Layout gốc: dùng Stack, mỗi màn hình là một file trong src/app
export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Nhắc việc' }} />
    </Stack>
  );
}
