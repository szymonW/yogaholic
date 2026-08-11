import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@/theme';

export default function RootLayout() {
  return (
    <>
      <Stack
        screenOptions={{ headerShown: false, animation: 'none', contentStyle: { backgroundColor: colors.background } }}
        initialRouteName="index"
      >
        <Stack.Screen name="create-exercise" options={{ presentation: 'modal' }} />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}
