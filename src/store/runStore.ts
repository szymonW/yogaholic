import { create } from 'zustand';
import type { Exercise, RunPhase, Sequence } from '@/types';

interface RunState {
  sequenceId: string | null;
  exercises: Exercise[];
  prepSeconds: number;
  runIndex: number;
  phase: RunPhase;
  /** ms epoch when the current phase ends */
  phaseEndsAt: number;
  paused: boolean;
  /** ms remaining in the current phase, frozen at the moment of pausing */
  pausedRemainingMs: number;
  /** ms epoch as of the last tick — the only field whose change forces a re-render for the countdown */
  now: number;

  start: (sequence: Sequence, prepSeconds: number) => void;
  tick: () => void;
  togglePause: () => void;
  skip: () => void;
  reset: () => void;
}

const IDLE: Omit<RunState, 'start' | 'tick' | 'togglePause' | 'skip' | 'reset'> = {
  sequenceId: null,
  exercises: [],
  prepSeconds: 0,
  runIndex: 0,
  phase: 'idle',
  phaseEndsAt: 0,
  paused: false,
  pausedRemainingMs: 0,
  now: Date.now(),
};

export const useRunStore = create<RunState>()((set, get) => ({
  ...IDLE,

  start: (sequence, prepSeconds) => {
    const now = Date.now();
    set({
      sequenceId: sequence.id,
      exercises: sequence.exercises,
      prepSeconds,
      runIndex: 0,
      phase: sequence.exercises.length > 0 ? 'prep' : 'complete',
      phaseEndsAt: now + prepSeconds * 1000,
      paused: false,
      pausedRemainingMs: 0,
      now,
    });
  },

  // Loops so a long time in the background (throttled JS timers) catches up in one go
  // instead of requiring one tick per missed phase, and stays drift-free by chaining
  // each phase's end time off the previous one rather than off `now`.
  tick: () => {
    const state = get();
    if (state.paused || (state.phase !== 'prep' && state.phase !== 'exercise')) return;

    let { phase, runIndex, phaseEndsAt } = state;
    const now = Date.now();

    while (now >= phaseEndsAt) {
      if (phase === 'prep') {
        phase = 'exercise';
        phaseEndsAt += state.exercises[runIndex].duration * 1000;
      } else {
        const nextIndex = runIndex + 1;
        if (nextIndex >= state.exercises.length) {
          set({ phase: 'complete', now });
          return;
        }
        runIndex = nextIndex;
        phase = 'prep';
        phaseEndsAt += state.prepSeconds * 1000;
      }
    }

    set({ phase, runIndex, phaseEndsAt, now });
  },

  togglePause: () => {
    const state = get();
    if (state.phase !== 'prep' && state.phase !== 'exercise') return;
    const now = Date.now();
    if (state.paused) {
      set({ paused: false, phaseEndsAt: now + state.pausedRemainingMs, now });
    } else {
      set({ paused: true, pausedRemainingMs: Math.max(0, state.phaseEndsAt - now), now });
    }
  },

  skip: () => {
    const state = get();
    if (state.phase !== 'prep' && state.phase !== 'exercise') return;
    const now = Date.now();
    const nextIndex = state.runIndex + 1;
    if (nextIndex >= state.exercises.length) {
      set({ phase: 'complete', now });
      return;
    }
    set({ runIndex: nextIndex, phase: 'prep', phaseEndsAt: now + state.prepSeconds * 1000, paused: false, now });
  },

  reset: () => set({ ...IDLE, now: Date.now() }),
}));

type RunSnapshot = Pick<RunState, 'phase' | 'phaseEndsAt' | 'paused' | 'pausedRemainingMs' | 'now'>;

/** Whole seconds left in the current phase — 0 outside prep/exercise. */
export function getRemainingSeconds(state: RunSnapshot): number {
  if (state.phase !== 'prep' && state.phase !== 'exercise') return 0;
  const ms = state.paused ? state.pausedRemainingMs : Math.max(0, state.phaseEndsAt - state.now);
  return Math.ceil(ms / 1000);
}

/** 0–1 fraction of the current exercise elapsed (0 during prep). */
export function getExerciseProgress(state: RunSnapshot & Pick<RunState, 'exercises' | 'runIndex'>): number {
  if (state.phase !== 'exercise') return 0;
  const duration = state.exercises[state.runIndex]?.duration ?? 0;
  if (duration <= 0) return 0;
  const remaining = getRemainingSeconds(state);
  return Math.min(1, Math.max(0, 1 - remaining / duration));
}

/** 0–1 fraction of the whole sequence completed, for the top progress bar. */
export function getOverallProgress(state: RunSnapshot & Pick<RunState, 'exercises' | 'runIndex'>): number {
  if (state.exercises.length === 0) return 0;
  const doneFraction = state.runIndex + getExerciseProgress(state);
  return Math.min(1, Math.max(0, doneFraction / state.exercises.length));
}
