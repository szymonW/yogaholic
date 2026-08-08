import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { getExerciseProgress, getOverallProgress, getRemainingSeconds, useRunStore } from '@/store/runStore';
import { useSequencesStore } from '@/store/sequencesStore';
import { useSettingsStore } from '@/store/settingsStore';
import type { Sequence } from '@/types';

/**
 * Drives a run: starts the store once per sequence id, ticks it every second, and
 * re-syncs immediately when the app returns from the background (tick() itself is
 * timestamp-based, so a single catch-up tick is enough after any amount of time away).
 */
export function useRunTimer(sequence: Sequence | undefined) {
  const prepSeconds = useSettingsStore((state) => state.prepCountdownSeconds);
  const pushRecent = useSequencesStore((state) => state.pushRecent);

  const phase = useRunStore((state) => state.phase);
  const runIndex = useRunStore((state) => state.runIndex);
  const paused = useRunStore((state) => state.paused);
  const phaseEndsAt = useRunStore((state) => state.phaseEndsAt);
  const pausedRemainingMs = useRunStore((state) => state.pausedRemainingMs);
  const now = useRunStore((state) => state.now);
  const exercises = useRunStore((state) => state.exercises);

  const startedForId = useRef<string | null>(null);
  const latest = useRef({ prepSeconds, pushRecent });
  useEffect(() => {
    latest.current = { prepSeconds, pushRecent };
  });

  useEffect(() => {
    if (!sequence || startedForId.current === sequence.id) return;
    startedForId.current = sequence.id;
    useRunStore.getState().start(sequence, latest.current.prepSeconds);
    latest.current.pushRecent(sequence.id);
  }, [sequence]);

  useEffect(() => {
    const interval = setInterval(() => useRunStore.getState().tick(), 1000);
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') useRunStore.getState().tick();
    });
    return () => {
      clearInterval(interval);
      subscription.remove();
    };
  }, []);

  const snapshot = { phase, phaseEndsAt, paused, pausedRemainingMs, now, exercises, runIndex };

  return {
    phase,
    runIndex,
    paused,
    exercises,
    currentExercise: exercises[runIndex],
    remainingSeconds: getRemainingSeconds(snapshot),
    exerciseProgress: getExerciseProgress(snapshot),
    overallProgress: getOverallProgress(snapshot),
    togglePause: () => useRunStore.getState().togglePause(),
    skip: () => useRunStore.getState().skip(),
    previous: () => useRunStore.getState().previous(),
    canGoPrevious: runIndex > 0,
  };
}
