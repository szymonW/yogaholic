import type { Exercise } from '@/types';

/** Formats whole seconds as "m:ss", e.g. 95 -> "1:35". */
export function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

/** Sum of exercise durations, formatted as "m:ss". */
export function totalDuration(exercises: Exercise[]): string {
  return formatDuration(exercises.reduce((sum, exercise) => sum + exercise.duration, 0));
}
