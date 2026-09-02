import { pl, type Translations } from './pl';

// Placeholder: English isn't translated yet (not selectable in the language picker), but this
// still needs to exist so detectInitialLanguage's fallback to 'en' resolves to real strings
// instead of missing keys. Replace with actual English copy when the language ships.
export const en = pl satisfies Translations;
