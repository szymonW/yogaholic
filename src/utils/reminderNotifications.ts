import { Platform } from 'react-native';
import { isExpoGo } from '@/utils/environment';

// Fixed identifier — every (re)schedule call replaces whatever this id currently points to,
// so the app never accumulates duplicate reminders no matter how often settings change.
const REMINDER_NOTIFICATION_ID = 'yogaholic-daily-reminder';
const ANDROID_CHANNEL_ID = 'reminders';

// expo-notifications must never be statically imported: as of SDK 53, merely importing it throws
// on Android in Expo Go (its push-token auto-registration runs at import time and that path
// throws there — see isExpoGo's doc), which would crash app/_layout.tsx before it ever renders.
// Load it lazily via `require`, and only from call sites already guarded by `!isExpoGo`.
let notifications: typeof import('expo-notifications') | undefined;
function getNotifications() {
  if (!notifications) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    notifications = require('expo-notifications') as typeof import('expo-notifications');
    // A system notification (like a WhatsApp message) has no way to run app code at delivery
    // time, so it can't itself check "have I exercised today?". Instead this module always
    // schedules a single one-shot notification for the next moment that condition can be true —
    // today at HH:MM if that's still ahead and nothing's logged yet, otherwise tomorrow — and the
    // caller re-syncs this whenever the toggle, the time, or today's history changes.
    notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });
  }
  return notifications;
}

async function ensureAndroidChannel(Notifications: ReturnType<typeof getNotifications>) {
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
  // Expo Go can't run this (see getNotifications) — reminders are simply unavailable there;
  // a dev/production build (e.g. an installed APK) is unaffected and schedules normally.
  if (isExpoGo) return;

  const Notifications = getNotifications();
  await Notifications.cancelScheduledNotificationAsync(REMINDER_NOTIFICATION_ID).catch(() => {});

  if (!enabled) return;

  // Android 13+ only shows the permission prompt correctly once the channel it'll post through
  // already exists, so the channel must be created before requestPermissionsAsync is called.
  await ensureAndroidChannel(Notifications);

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
