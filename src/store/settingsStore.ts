import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { detectInitialLanguage } from '@/i18n/detectLanguage';
import { storage } from './storage';

// Default reminder time when a user first enables it — matches no particular science, just
// a plausible early-evening practice slot.
const REMINDER_HOUR_DEFAULT = 18;

interface SettingsState {
  // Doubles as the "Przypomnij mi o ćwiczeniach" toggle on the Goals screen and the
  // "Notifications" toggle on the Settings screen — one switch, shown in two places.
  notificationsEnabled: boolean;
  instructorVoiceEnabled: boolean;
  prepCountdownSeconds: number;
  reminderHour: number;
  language: string;
  toggleNotifications: () => void;
  toggleInstructorVoice: () => void;
  setPrepCountdown: (seconds: number) => void;
  setReminderHour: (hour: number) => void;
  setLanguage: (language: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      notificationsEnabled: false,
      instructorVoiceEnabled: true,
      prepCountdownSeconds: 3,
      reminderHour: REMINDER_HOUR_DEFAULT,
      language: detectInitialLanguage(),
      toggleNotifications: () => set((state) => ({ notificationsEnabled: !state.notificationsEnabled })),
      toggleInstructorVoice: () => set((state) => ({ instructorVoiceEnabled: !state.instructorVoiceEnabled })),
      setPrepCountdown: (seconds) => set({ prepCountdownSeconds: seconds }),
      setReminderHour: (hour) => set({ reminderHour: ((hour % 24) + 24) % 24 }),
      setLanguage: (language) => set({ language }),
    }),
    { name: 'yogaholic/settings', storage }
  )
);
