import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Fixed identifier — every (re)schedule call replaces whatever this id currently points to,
// so the app never accumulates duplicate reminders no matter how often settings change.
const REMINDER_NOTIFICATION_ID = 'yogaholic-daily-reminder';
const ANDROID_CHANNEL_ID = 'reminders';

// A system notification (like a WhatsApp message) has no way to run app code at delivery time,
// so it can't itself check "have I exercised today?". Instead this module always schedules a
// single one-shot notification for the next moment that condition can be true — today at HH:MM
// if that's still ahead and nothing's logged yet, otherwise tomorrow — and the caller re-syncs
// this whenever the toggle, the time, or today's history changes.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function ensureAndroidChannel() {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
    name: 'Przypomnienia o ćwiczeniach',
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

interface SyncReminderParams {
  enabled: boolean;
  hour: number;
  minute: number;
  exercisedToday: boolean;
  title: string;
  body: string;
}

export async function syncReminderNotification({ enabled, hour, minute, exercisedToday, title, body }: SyncReminderParams): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(REMINDER_NOTIFICATION_ID).catch(() => {});

  if (!enabled) return;

  // Android 13+ only shows the permission prompt correctly once the channel it'll post through
  // already exists, so the channel must be created before requestPermissionsAsync is called.
  await ensureAndroidChannel();

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  const status = existingStatus === 'granted' ? existingStatus : (await Notifications.requestPermissionsAsync()).status;
  if (status !== 'granted') return;

  const now = new Date();
  const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0, 0);
  if (target.getTime() <= now.getTime() || exercisedToday) {
    target.setDate(target.getDate() + 1);
  }

  await Notifications.scheduleNotificationAsync({
    identifier: REMINDER_NOTIFICATION_ID,
    content: { title, body, sound: false },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: target,
      ...(Platform.OS === 'android' ? { channelId: ANDROID_CHANNEL_ID } : {}),
    },
  });
}
