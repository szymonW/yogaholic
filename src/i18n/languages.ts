export interface LanguageOption {
  code: string;
  label: string;
  /** Whether we ship real translations for this language and it can be picked in the UI. */
  available: boolean;
}

// Labels are shown as-is regardless of the current UI language (like a native language picker).
export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'pl', label: 'Polski', available: true },
  { code: 'en', label: 'Angielski', available: false },
  { code: 'de', label: 'Niemiecki', available: false },
  { code: 'fr', label: 'Francuski', available: false },
  { code: 'es', label: 'Hiszpański', available: false },
  { code: 'pt', label: 'Portugalski', available: false },
  { code: 'ko', label: 'Koreański', available: false },
  { code: 'ja', label: 'Japoński', available: false },
];

// Only device languages we actually ship translations for get auto-selected; everything else
// falls back to English (see detectInitialLanguage in ./index.ts).
export const SUPPORTED_LANGUAGE_CODES = LANGUAGE_OPTIONS.filter((option) => option.available).map((option) => option.code);
