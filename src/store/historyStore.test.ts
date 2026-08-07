import { migrateHistoryState, useHistoryStore } from './historyStore';

beforeEach(() => {
  useHistoryStore.setState({ entries: [] });
});

describe('useHistoryStore', () => {
  it('logSession appends an entry with a formatted date', () => {
    useHistoryStore.getState().logSession({
      sequenceId: 's1',
      durationSeconds: 205,
      exerciseCount: 5,
      date: new Date(2026, 7, 5),
    });
    const [entry] = useHistoryStore.getState().entries;
    expect(entry).toMatchObject({ sequenceId: 's1', durationSeconds: 205, exerciseCount: 5, dateISO: '2026-08-05' });
    expect(entry.id).toBeTruthy();
  });

  it('approximates startedAtMs as completion time minus the session duration', () => {
    const completedAt = new Date(2026, 7, 5, 7, 30, 0);
    useHistoryStore.getState().logSession({ sequenceId: 's1', durationSeconds: 205, exerciseCount: 5, date: completedAt });
    const [entry] = useHistoryStore.getState().entries;
    expect(entry.startedAtMs).toBe(completedAt.getTime() - 205 * 1000);
  });

  it('defaults to the current date when none is passed', () => {
    useHistoryStore.getState().logSession({ sequenceId: 's1', durationSeconds: 60, exerciseCount: 1 });
    expect(useHistoryStore.getState().entries[0].dateISO).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('appends without clobbering previous entries', () => {
    useHistoryStore.getState().logSession({ sequenceId: 's1', durationSeconds: 60, exerciseCount: 1 });
    useHistoryStore.getState().logSession({ sequenceId: 's2', durationSeconds: 120, exerciseCount: 2 });
    expect(useHistoryStore.getState().entries).toHaveLength(2);
  });
});

describe('migrateHistoryState', () => {
  it('backfills startedAtMs on entries persisted before it existed', () => {
    const legacy = {
      entries: [{ id: 'h1', sequenceId: 's1', dateISO: '2026-08-05', durationSeconds: 300, exerciseCount: 4 }],
    };
    const migrated = migrateHistoryState(legacy);
    expect(migrated.entries[0].startedAtMs).toBe(new Date(2026, 7, 5).getTime());
  });

  it('leaves entries that already have startedAtMs untouched', () => {
    const current = {
      entries: [{ id: 'h1', sequenceId: 's1', dateISO: '2026-08-05', startedAtMs: 123, durationSeconds: 300, exerciseCount: 4 }],
    };
    expect(migrateHistoryState(current).entries[0].startedAtMs).toBe(123);
  });

  it('handles a persisted state with no entries array', () => {
    expect(migrateHistoryState({})).toEqual({});
  });
});
