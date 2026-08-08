import { buildCastRunPayload, type CastRunSnapshot } from './payload';

const base: CastRunSnapshot = {
  phase: 'exercise',
  runIndex: 1,
  exerciseCount: 5,
  currentExerciseName: 'Pies z głową w dół (Adho Mukha Svanasana)',
  remainingSeconds: 95,
  exerciseProgress: 0.4,
  overallProgress: 0.32,
};

describe('buildCastRunPayload', () => {
  it('splits the exercise name into primary and original', () => {
    const payload = buildCastRunPayload(base);
    expect(payload.exerciseName).toBe('Pies z głową w dół');
    expect(payload.exerciseOriginal).toBe('Adho Mukha Svanasana');
  });

  it('formats remainingLabel as m:ss during the exercise phase', () => {
    const payload = buildCastRunPayload(base);
    expect(payload.isPrep).toBe(false);
    expect(payload.remainingLabel).toBe('1:35');
  });

  it('formats remainingLabel as a raw second count during prep', () => {
    const payload = buildCastRunPayload({ ...base, phase: 'prep', remainingSeconds: 3 });
    expect(payload.isPrep).toBe(true);
    expect(payload.remainingLabel).toBe('3');
  });

  it('omits exerciseOriginal when the name has no parenthesized part', () => {
    const payload = buildCastRunPayload({ ...base, currentExerciseName: 'Skłon' });
    expect(payload.exerciseName).toBe('Skłon');
    expect(payload.exerciseOriginal).toBeUndefined();
  });

  it('passes through progress and slug fields unchanged', () => {
    const payload = buildCastRunPayload({ ...base, imageSlug: 'dog' });
    expect(payload.exerciseProgress).toBe(0.4);
    expect(payload.overallProgress).toBe(0.32);
    expect(payload.imageSlug).toBe('dog');
  });
});
