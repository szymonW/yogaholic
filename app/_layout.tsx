import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }} initialRouteName="index">
        <Stack.Screen name="create-exercise" options={{ presentation: 'modal' }} />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}
