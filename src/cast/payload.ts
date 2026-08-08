import type { RunPhase } from '@/types';
import { splitExerciseName } from '@/utils/exercise';
import { formatDuration } from '@/utils/time';

/** Custom Cast Application Framework namespace for the run-state channel. */
export const RUN_CAST_NAMESPACE = 'urn:x-cast:com.szymonwsteam.yogaholic.run';

export interface CastRunMessage {
  type: 'run-state';
  phase: RunPhase;
  runIndex: number;
  exerciseCount: number;
  exerciseName: string;
  exerciseOriginal?: string;
  /** Pre-formatted for display: raw seconds during prep, "m:ss" during exercise. */
  remainingLabel: string;
  isPrep: boolean;
  exerciseProgress: number;
  overallProgress: number;
  imageSlug?: string;
}

/** Sent right before the phone navigates away to the completion screen, so the TV doesn't
 * freeze on the last exercise's frame with no further updates. */
export interface CastCompleteMessage {
  type: 'run-complete';
}

export type CastMessage = CastRunMessage | CastCompleteMessage;

export const CAST_COMPLETE_MESSAGE: CastCompleteMessage = { type: 'run-complete' };

export interface CastRunSnapshot {
  phase: RunPhase;
  runIndex: number;
  exerciseCount: number;
  currentExerciseName: string;
  remainingSeconds: number;
  exerciseProgress: number;
  overallProgress: number;
  imageSlug?: string;
}

/** Mirrors the derivation in app/run/[id].tsx so the TV shows exactly what the phone shows. */
export function buildCastRunPayload(snapshot: CastRunSnapshot): CastRunMessage {
  const { primary, original } = splitExerciseName(snapshot.currentExerciseName);
  const isPrep = snapshot.phase === 'prep';

  return {
    type: 'run-state',
    phase: snapshot.phase,
    runIndex: snapshot.runIndex,
    exerciseCount: snapshot.exerciseCount,
    exerciseName: primary,
    exerciseOriginal: original,
    remainingLabel: isPrep ? String(snapshot.remainingSeconds) : formatDuration(snapshot.remainingSeconds),
    isPrep,
    exerciseProgress: snapshot.exerciseProgress,
    overallProgress: snapshot.overallProgress,
    imageSlug: snapshot.imageSlug,
  };
}
