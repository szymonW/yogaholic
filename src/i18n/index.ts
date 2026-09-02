import { useSettingsStore } from '@/store';
import { en } from './locales/en';
import { pl } from './locales/pl';

export type { LanguageOption } from './languages';
export { LANGUAGE_OPTIONS } from './languages';
export { detectInitialLanguage } from './detectLanguage';

const catalogs = { pl, en };

export function useTranslation() {
  const language = useSettingsStore((state) => state.language);
  return catalogs[language as keyof typeof catalogs] ?? catalogs.en;
}
