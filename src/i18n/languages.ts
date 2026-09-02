export interface LanguageOption {
  code: string;
  label: string;
  /** Whether we ship real translations for this language and it can be picked in the UI. */
  available: boolean;
}

// Endonyms: each language is labelled in itself, so the list reads the same whichever UI
// language is active (the labels are never translated).
export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'pl', label: 'Polski', available: true },
  { code: 'en', label: 'English', available: true },
  { code: 'de', label: 'Deutsch', available: false },
  { code: 'fr', label: 'Français', available: false },
  { code: 'es', label: 'Español', available: false },
  { code: 'pt', label: 'Português', available: false },
  { code: 'ko', label: '한국어', available: false },
  { code: 'ja', label: '日本語', available: false },
];

// Only device languages we actually ship translations for get auto-selected; everything else
// falls back to English (see detectInitialLanguage in ./index.ts).
export const SUPPORTED_LANGUAGE_CODES = LANGUAGE_OPTIONS.filter((option) => option.available).map((option) => option.code);
