import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useTranslation } from '@/i18n';
import { useHistoryStore, useSettingsStore } from '@/store';
import { colors } from '@/theme';
import { toISODate } from '@/utils/history';
import { syncReminderNotification } from '@/utils/reminderNotifications';

export default function RootLayout() {
  const t = useTranslation();
  const { notificationsEnabled, reminderHour, reminderMinute } = useSettingsStore();
  const entries = useHistoryStore((state) => state.entries);
  const exercisedToday = entries.some((entry) => entry.dateISO === toISODate(new Date()));

  // Re-derives the one scheduled reminder notification whenever the toggle, its time, or
  // today's history changes — see reminderNotifications.ts for why this can't be a simple
  // repeating daily trigger.
  useEffect(() => {
    syncReminderNotification({
      enabled: notificationsEnabled,
      hour: reminderHour,
      minute: reminderMinute,
      exercisedToday,
      title: t.goals.reminder,
      body: t.home.reminderNotificationBody,
    });
  }, [notificationsEnabled, reminderHour, reminderMinute, exercisedToday, t]);

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
