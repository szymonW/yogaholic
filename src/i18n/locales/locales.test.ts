import { EXERCISE_POOL } from '@/data/exercisePool';
import { BASE_SEQUENCES, CUSTOM_SEEDS } from '@/data/sampleSequences';
import { en } from './en';
import { pl } from './pl';

// Display sites resolve seed content as `t.exercises[exercise.name] ?? exercise.name` (and the
// same for sequence titles). That fallback exists for user-created content, but it also means a
// missing catalog entry fails silently — an English user just sees the Polish name. These tests
// close that gap: add a pose or sequence to src/data and the catalogs must keep up.

const seedExerciseNames = [
  ...EXERCISE_POOL.map((exercise) => exercise.name),
  ...[...BASE_SEQUENCES, ...CUSTOM_SEEDS].flatMap((sequence) => sequence.exercises.map((exercise) => exercise.name)),
];
const seedSequenceIds = [...BASE_SEQUENCES, ...CUSTOM_SEEDS].map((sequence) => sequence.id);

describe.each([
  ['pl', pl],
  ['en', en],
])('%s catalog', (_code, catalog) => {
  it('names every seed exercise', () => {
    const missing = [...new Set(seedExerciseNames)].filter((name) => !catalog.exercises[name]);
    expect(missing).toEqual([]);
  });

  it('titles every seed sequence', () => {
    const missing = [...new Set(seedSequenceIds)].filter((id) => !catalog.sequences[id]);
    expect(missing).toEqual([]);
  });

  it('has no entries for content that no longer exists', () => {
    expect(Object.keys(catalog.exercises).filter((name) => !seedExerciseNames.includes(name))).toEqual([]);
    expect(Object.keys(catalog.sequences).filter((id) => !seedSequenceIds.includes(id))).toEqual([]);
  });
});

describe('en catalog', () => {
  it('translates every seed name rather than leaving the Polish through', () => {
    const untranslated = Object.keys(pl.exercises).filter((name) => en.exercises[name] === pl.exercises[name]);
    expect(untranslated).toEqual([]);
  });

  it('keeps the Monday-first weekday order the calendar grid indexes into', () => {
    expect(en.calendar.weekdayLetters).toHaveLength(7);
    expect(en.calendar.weekdayLetters[0]).toBe('Mo');
    expect(en.calendar.weekdayLetters[6]).toBe('Su');
  });

  it('has twelve month names, long and short', () => {
    expect(en.calendar.monthNames).toHaveLength(12);
    expect(en.calendar.monthNamesShort).toHaveLength(12);
  });
});
