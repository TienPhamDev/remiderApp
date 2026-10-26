import { Roboto_400Regular, Roboto_500Medium } from '@expo-google-fonts/roboto';
import { PlayfairDisplay_800ExtraBold } from '@expo-google-fonts/playfair-display';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { colors, fonts, typography } from '../theme';

// Giữ màn hình splash cho đến khi font tải xong
SplashScreen.preventAutoHideAsync();

// Layout gốc: Stack tối màu theo theme Listodo
export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    [fonts.regular]: Roboto_400Regular,
    [fonts.medium]: Roboto_500Medium,
    [fonts.logo]: PlayfairDisplay_800ExtraBold,
  });

  // Tải xong (hoặc lỗi) thì ẩn splash, lỗi font vẫn cho vào app
  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

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
