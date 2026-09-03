import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { detectInitialLanguage } from '@/i18n/detectLanguage';
import { storage } from './storage';

// Default reminder time when a user first enables it — matches no particular science, just
// a plausible early-evening practice slot.
const REMINDER_HOUR_DEFAULT = 18;
const REMINDER_MINUTE_DEFAULT = 0;
// Minute picker moves in 5-minute increments (like a NumberPicker's arrow taps) — a reminder
// doesn't need second/minute precision, and 1-minute steps would take up to 59 taps to dial in.
const REMINDER_MINUTE_STEP = 5;

interface SettingsState {
  // Doubles as the "Przypomnij mi o ćwiczeniach" toggle on the Goals screen and the
  // "Notifications" toggle on the Settings screen — one switch, shown in two places.
  notificationsEnabled: boolean;
  instructorVoiceEnabled: boolean;
  prepCountdownSeconds: number;
  reminderHour: number;
  reminderMinute: number;
  language: string;
  toggleNotifications: () => void;
  toggleInstructorVoice: () => void;
  setPrepCountdown: (seconds: number) => void;
  incReminderHour: () => void;
  decReminderHour: () => void;
  incReminderMinute: () => void;
  decReminderMinute: () => void;
  setLanguage: (language: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      notificationsEnabled: false,
      instructorVoiceEnabled: true,
      prepCountdownSeconds: 3,
      reminderHour: REMINDER_HOUR_DEFAULT,
      reminderMinute: REMINDER_MINUTE_DEFAULT,
      language: detectInitialLanguage(),
      toggleNotifications: () => set((state) => ({ notificationsEnabled: !state.notificationsEnabled })),
      toggleInstructorVoice: () => set((state) => ({ instructorVoiceEnabled: !state.instructorVoiceEnabled })),
      setPrepCountdown: (seconds) => set({ prepCountdownSeconds: seconds }),
      incReminderHour: () => set((state) => ({ reminderHour: (state.reminderHour + 1) % 24 })),
      decReminderHour: () => set((state) => ({ reminderHour: (state.reminderHour + 23) % 24 })),
      incReminderMinute: () =>
        set((state) => ({ reminderMinute: (state.reminderMinute + REMINDER_MINUTE_STEP) % 60 })),
      decReminderMinute: () =>
        set((state) => ({ reminderMinute: (state.reminderMinute + 60 - REMINDER_MINUTE_STEP) % 60 })),
      setLanguage: (language) => set({ language }),
    }),
    { name: 'yogaholic/settings', storage }
  )
);
