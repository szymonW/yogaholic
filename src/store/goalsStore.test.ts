import { getSessionGoalForDate, resolveSessionsPerDay, useGoalsStore, type GoalHistoryEntry } from './goalsStore';
import { toISODate } from '@/utils/history';

const todayISO = () => toISODate(new Date());

beforeEach(() => {
  useGoalsStore.setState({
    goalHistory: [{ sinceISO: '1970-01-01', sessionsPerDay: [1, 1, 0, 1, 1, 0, 1] }],
    goalMinutes: 60,
  });
});

describe('useGoalsStore', () => {
  it('increments and decrements a single day in today\'s snapshot, leaving the others untouched', () => {
    useGoalsStore.getState().incSessionDay(2);
    let latest = useGoalsStore.getState().goalHistory.at(-1)!;
    expect(latest.sessionsPerDay).toEqual([1, 1, 1, 1, 1, 0, 1]);
    expect(latest.sinceISO).toBe(todayISO());

    useGoalsStore.getState().decSessionDay(0);
    latest = useGoalsStore.getState().goalHistory.at(-1)!;
    expect(latest.sessionsPerDay).toEqual([0, 1, 1, 1, 1, 0, 1]);
  });

  it('clamps a day to [0, 5]', () => {
    useGoalsStore.setState({ goalHistory: [{ sinceISO: '1970-01-01', sessionsPerDay: [0, 1, 0, 1, 1, 0, 1] }] });
    useGoalsStore.getState().decSessionDay(0);
    expect(useGoalsStore.getState().goalHistory.at(-1)!.sessionsPerDay[0]).toBe(0);

    useGoalsStore.setState({ goalHistory: [{ sinceISO: '1970-01-01', sessionsPerDay: [5, 1, 0, 1, 1, 0, 1] }] });
    useGoalsStore.getState().incSessionDay(0);
    expect(useGoalsStore.getState().goalHistory.at(-1)!.sessionsPerDay[0]).toBe(5);
  });

  it('upserts today\'s snapshot instead of appending a new entry for every edit', () => {
    useGoalsStore.setState({ goalHistory: [{ sinceISO: todayISO(), sessionsPerDay: [1, 1, 0, 1, 1, 0, 1] }] });
    useGoalsStore.getState().incSessionDay(2);
    useGoalsStore.getState().incSessionDay(3);
    expect(useGoalsStore.getState().goalHistory).toHaveLength(1);
    expect(useGoalsStore.getState().goalHistory[0].sessionsPerDay).toEqual([1, 1, 1, 2, 1, 0, 1]);
  });

  it('appends a new snapshot for today rather than mutating a past one', () => {
    useGoalsStore.setState({ goalHistory: [{ sinceISO: '2026-08-01', sessionsPerDay: [0, 0, 0, 0, 0, 0, 0] }] });
    useGoalsStore.getState().incSessionDay(0);
    const history = useGoalsStore.getState().goalHistory;
    expect(history).toHaveLength(2);
    expect(history[0]).toEqual({ sinceISO: '2026-08-01', sessionsPerDay: [0, 0, 0, 0, 0, 0, 0] });
    expect(history[1]).toEqual({ sinceISO: todayISO(), sessionsPerDay: [1, 0, 0, 0, 0, 0, 0] });
  });

  it('steps goalMinutes by 5 and clamps to [5, 600]', () => {
    useGoalsStore.getState().incGoalMinutes();
    expect(useGoalsStore.getState().goalMinutes).toBe(65);

    useGoalsStore.setState({ goalMinutes: 600 });
    useGoalsStore.getState().incGoalMinutes();
    expect(useGoalsStore.getState().goalMinutes).toBe(600);

    useGoalsStore.setState({ goalMinutes: 5 });
    useGoalsStore.getState().decGoalMinutes();
    expect(useGoalsStore.getState().goalMinutes).toBe(5);
  });
});

describe('resolveSessionsPerDay / getSessionGoalForDate', () => {
  const history: GoalHistoryEntry[] = [
    { sinceISO: '2026-01-01', sessionsPerDay: [0, 0, 0, 0, 0, 0, 0] },
    { sinceISO: '2026-08-15', sessionsPerDay: [1, 1, 1, 1, 1, 1, 1] },
  ];

  it('resolves a date before any goal change to the earliest snapshot', () => {
    expect(resolveSessionsPerDay(history, '2026-06-01')).toEqual([0, 0, 0, 0, 0, 0, 0]);
  });

  it('resolves a date on/after a later change to that newer snapshot — never retroactively', () => {
    expect(resolveSessionsPerDay(history, '2026-08-15')).toEqual([1, 1, 1, 1, 1, 1, 1]);
    expect(resolveSessionsPerDay(history, '2026-09-01')).toEqual([1, 1, 1, 1, 1, 1, 1]);
  });

  it('a goal change does not alter the goal recorded for a day before the change', () => {
    // A past Monday (2026-08-03) must keep reading against the old (zero) goal even though the
    // goal was later raised on 2026-08-15 — the whole point of keeping a history instead of a
    // single current value.
    const pastMonday = new Date(2026, 7, 3);
    expect(getSessionGoalForDate(history, pastMonday)).toBe(0);

    const futureMonday = new Date(2026, 7, 31);
    expect(getSessionGoalForDate(history, futureMonday)).toBe(1);
  });
});
