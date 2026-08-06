import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { storage } from './storage';

interface SettingsState {
  notificationsEnabled: boolean;
  instructorVoiceEnabled: boolean;
  prepCountdownSeconds: number;
  toggleNotifications: () => void;
  toggleInstructorVoice: () => void;
  setPrepCountdown: (seconds: number) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      notificationsEnabled: true,
      instructorVoiceEnabled: true,
      prepCountdownSeconds: 3,
      toggleNotifications: () => set((state) => ({ notificationsEnabled: !state.notificationsEnabled })),
      toggleInstructorVoice: () => set((state) => ({ instructorVoiceEnabled: !state.instructorVoiceEnabled })),
      setPrepCountdown: (seconds) => set({ prepCountdownSeconds: seconds }),
    }),
    { name: 'yogaholic/settings', storage }
  )
);
