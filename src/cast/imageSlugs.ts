/**
 * Maps an exercise name to the stable slug used to resolve its image on the Cast receiver.
 * Only pool entries with a bundled `imageUri` (see src/data/exercisePool.ts) get a slug — the
 * receiver can't reach a phone's local filesystem, so user-picked photos and any name missing
 * here fall back to a text placeholder. Keep in sync with receiver/receiver.js's IMAGE_SLUGS
 * map and the files under receiver/assets/.
 */
export const EXERCISE_IMAGE_SLUGS: Record<string, string> = {
  'Pies z głową w dół (Adho Mukha Svanasana)': 'dog',
  'Przysiad jogina (Malasana)': 'malasana',
  'Siad skrzyżny (Sukhasana)': 'siad-skrzyzny',
};
