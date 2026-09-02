import * as Localization from 'expo-localization';
import { SUPPORTED_LANGUAGE_CODES } from './languages';

/** Device language if we ship translations for it, otherwise English. Used as the settings store's initial value — runs once, before any persisted or manually-picked language takes over. */
export function detectInitialLanguage(): string {
  const deviceCode = Localization.getLocales()[0]?.languageCode;
  return deviceCode && SUPPORTED_LANGUAGE_CODES.includes(deviceCode) ? deviceCode : 'en';
}
