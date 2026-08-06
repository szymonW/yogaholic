import type { Sequence } from '@/types';
import { getExerciseProgress, getOverallProgress, getRemainingSeconds, useRunStore } from './runStore';

const sequence: Sequence = {
  id: 's1',
  title: 'Test',
  exercises: [
    { name: 'A', duration: 10 },
    { name: 'B', duration: 20 },
  ],
};

beforeEach(() => {
  jest.useFakeTimers();
  useRunStore.getState().reset();
});

afterEach(() => {
  jest.useRealTimers();
});

function advanceAndTick(ms: number) {
  jest.advanceTimersByTime(ms);
  useRunStore.getState().tick();
}

describe('start', () => {
  it('enters the prep phase for prepSeconds on exercise 0', () => {
    useRunStore.getState().start(sequence, 3);
    const state = useRunStore.getState();
    expect(state.phase).toBe('prep');
    expect(state.runIndex).toBe(0);
    expect(state.paused).toBe(false);
    expect(getRemainingSeconds(state)).toBe(3);
  });

  it('goes straight to complete for a sequence with no exercises', () => {
    useRunStore.getState().start({ id: 'empty', title: 'Empty', exercises: [] }, 3);
    expect(useRunStore.getState().phase).toBe('complete');
  });
});

describe('tick', () => {
  it('is a no-op before the current phase expires', () => {
    useRunStore.getState().start(sequence, 3);
    advanceAndTick(1000);
    const state = useRunStore.getState();
    expect(state.phase).toBe('prep');
    expect(getRemainingSeconds(state)).toBe(2);
  });

  it('transitions prep -> exercise once prepSeconds elapse', () => {
    useRunStore.getState().start(sequence, 3);
    advanceAndTick(3000);
    const state = useRunStore.getState();
    expect(state.phase).toBe('exercise');
    expect(state.runIndex).toBe(0);
    expect(getRemainingSeconds(state)).toBe(10);
  });

  it('walks the full sequence through to complete', () => {
    useRunStore.getState().start(sequence, 3);

    advanceAndTick(3000); // prep -> exercise A
    expect(useRunStore.getState().phase).toBe('exercise');

    advanceAndTick(10000); // exercise A -> prep B
    let state = useRunStore.getState();
    expect(state.phase).toBe('prep');
    expect(state.runIndex).toBe(1);

    advanceAndTick(3000); // prep B -> exercise B
    state = useRunStore.getState();
    expect(state.phase).toBe('exercise');
    expect(state.runIndex).toBe(1);

    advanceAndTick(20000); // exercise B -> complete
    expect(useRunStore.getState().phase).toBe('complete');
  });

  it('catches up through every missed phase in a single tick after a long gap (e.g. backgrounded app)', () => {
    useRunStore.getState().start(sequence, 3);
    advanceAndTick(3000 + 10000 + 3000 + 20000 + 5000); // well past the end of the sequence
    expect(useRunStore.getState().phase).toBe('complete');
  });

  it('does nothing once the sequence is complete', () => {
    useRunStore.getState().start(sequence, 3);
    advanceAndTick(3000 + 10000 + 3000 + 20000);
    expect(useRunStore.getState().phase).toBe('complete');
    advanceAndTick(5000);
    expect(useRunStore.getState().phase).toBe('complete');
  });
});

describe('togglePause', () => {
  it('freezes the remaining time and tick becomes a no-op', () => {
    useRunStore.getState().start(sequence, 3);
    advanceAndTick(1000); // 2s left in prep
    useRunStore.getState().togglePause();
    expect(useRunStore.getState().paused).toBe(true);
    expect(getRemainingSeconds(useRunStore.getState())).toBe(2);

    jest.advanceTimersByTime(5000);
    useRunStore.getState().tick();
    const state = useRunStore.getState();
    expect(state.phase).toBe('prep');
    expect(getRemainingSeconds(state)).toBe(2);
  });

  it('resumes from the exact frozen remaining time, ignoring time spent paused', () => {
    useRunStore.getState().start(sequence, 3);
    advanceAndTick(1000); // 2s left
    useRunStore.getState().togglePause();
    jest.advanceTimersByTime(60_000); // a full minute passes while paused
    useRunStore.getState().togglePause(); // resume
    expect(getRemainingSeconds(useRunStore.getState())).toBe(2);

    advanceAndTick(2000); // the 2s that were left
    expect(useRunStore.getState().phase).toBe('exercise');
  });
});

describe('skip', () => {
  it('jumps straight to the next exercise prep from the prep phase', () => {
    useRunStore.getState().start(sequence, 3);
    useRunStore.getState().skip();
    const state = useRunStore.getState();
    expect(state.phase).toBe('prep');
    expect(state.runIndex).toBe(1);
  });

  it('jumps straight to the next exercise prep from the exercise phase', () => {
    useRunStore.getState().start(sequence, 3);
    advanceAndTick(3000); // now in exercise 0
    useRunStore.getState().skip();
    const state = useRunStore.getState();
    expect(state.phase).toBe('prep');
    expect(state.runIndex).toBe(1);
  });

  it('completes the sequence when skipping past the last exercise', () => {
    useRunStore.getState().start(sequence, 3);
    useRunStore.getState().skip(); // -> prep exercise 1 (last)
    useRunStore.getState().skip(); // -> complete
    expect(useRunStore.getState().phase).toBe('complete');
  });

  it('un-pauses on skip', () => {
    useRunStore.getState().start(sequence, 3);
    useRunStore.getState().togglePause();
    useRunStore.getState().skip();
    expect(useRunStore.getState().paused).toBe(false);
  });
});

describe('reset', () => {
  it('clears the run back to idle', () => {
    useRunStore.getState().start(sequence, 3);
    useRunStore.getState().reset();
    const state = useRunStore.getState();
    expect(state.phase).toBe('idle');
    expect(state.sequenceId).toBeNull();
    expect(state.runIndex).toBe(0);
  });
});

describe('getExerciseProgress / getOverallProgress', () => {
  it('is 0 during prep and grows through the exercise phase', () => {
    useRunStore.getState().start(sequence, 3);
    advanceAndTick(3000); // exercise A, 10s, just started
    expect(getExerciseProgress(useRunStore.getState())).toBeCloseTo(0, 5);

    jest.advanceTimersByTime(5000); // halfway through exercise A
    useRunStore.getState().tick();
    expect(getExerciseProgress(useRunStore.getState())).toBeCloseTo(0.5, 1);
  });

  it('overall progress accounts for completed exercises plus progress into the current one', () => {
    useRunStore.getState().start(sequence, 3);
    advanceAndTick(3000 + 10000); // exercise A done, now in prep B
    expect(getOverallProgress(useRunStore.getState())).toBeCloseTo(0.5, 5);
  });

  it('is 0 when there are no exercises', () => {
    const state = { phase: 'idle' as const, phaseEndsAt: 0, paused: false, pausedRemainingMs: 0, now: 0, exercises: [], runIndex: 0 };
    expect(getOverallProgress(state)).toBe(0);
    expect(getExerciseProgress(state)).toBe(0);
  });
});
