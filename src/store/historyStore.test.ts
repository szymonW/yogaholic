import { useHistoryStore } from './historyStore';

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
