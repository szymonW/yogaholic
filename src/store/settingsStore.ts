import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { detectInitialLanguage } from '@/i18n/detectLanguage';
import { storage } from './storage';

interface SettingsState {
  notificationsEnabled: boolean;
  instructorVoiceEnabled: boolean;
  prepCountdownSeconds: number;
  language: string;
  toggleNotifications: () => void;
  toggleInstructorVoice: () => void;
  setPrepCountdown: (seconds: number) => void;
  setLanguage: (language: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      notificationsEnabled: true,
      instructorVoiceEnabled: true,
      prepCountdownSeconds: 3,
      language: detectInitialLanguage(),
      toggleNotifications: () => set((state) => ({ notificationsEnabled: !state.notificationsEnabled })),
      toggleInstructorVoice: () => set((state) => ({ instructorVoiceEnabled: !state.instructorVoiceEnabled })),
      setPrepCountdown: (seconds) => set({ prepCountdownSeconds: seconds }),
      setLanguage: (language) => set({ language }),
    }),
    { name: 'yogaholic/settings', storage }
  )
);
