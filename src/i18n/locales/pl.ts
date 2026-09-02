export const pl = {
  settingsTitle: 'Ustawienia',
  notifications: 'Powiadomienia',
  instructorVoice: 'Głos instruktora',
  prepCountdown: 'Odliczanie przygotowania',
  prepCountdownValue: (seconds: number) => `${seconds} s`,
  language: 'Język',
  appVersion: 'Wersji aplikacji',
  languagePickerTitle: 'Język',
  close: 'Zamknij',
  comingSoon: 'wkrótce',
} as const;

export type Translations = typeof pl;
