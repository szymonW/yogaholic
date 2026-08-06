import type { HistoryEntry } from '@/types';
import { addDays, computeStreak, getWeekBounds, parseISODate, summarizeWeek, toISODate } from './history';

const entry = (dateISO: string, durationSeconds = 300): HistoryEntry => ({
  id: dateISO,
  sequenceId: 's1',
  dateISO,
  durationSeconds,
  exerciseCount: 4,
});

describe('toISODate / parseISODate', () => {
  it('round-trips a local date without shifting days', () => {
    const date = new Date(2026, 7, 5); // 2026-08-05, local time
    expect(toISODate(date)).toBe('2026-08-05');
    expect(toISODate(parseISODate('2026-08-05'))).toBe('2026-08-05');
  });

  it('pads single-digit months and days', () => {
    expect(toISODate(new Date(2026, 0, 3))).toBe('2026-01-03');
  });
});

describe('addDays', () => {
  it('adds and subtracts days without mutating the input', () => {
    const date = new Date(2026, 7, 5);
    const next = addDays(date, 3);
    const prev = addDays(date, -3);
    expect(toISODate(next)).toBe('2026-08-08');
    expect(toISODate(prev)).toBe('2026-08-02');
    expect(toISODate(date)).toBe('2026-08-05');
  });
});

describe('getWeekBounds', () => {
  it('returns a Monday-start, Sunday-end range', () => {
    const wednesday = new Date(2026, 7, 5); // 2026-08-05 is a Wednesday
    const { start, end } = getWeekBounds(wednesday);
    expect(toISODate(start)).toBe('2026-08-03'); // Monday
    expect(toISODate(end)).toBe('2026-08-09'); // Sunday
  });
});

describe('summarizeWeek', () => {
  it('counts only sessions within the Monday-start week and sums minutes', () => {
    const entries = [
      entry('2026-08-03', 300), // Monday, in week
      entry('2026-08-05', 600), // Wednesday, in week
      entry('2026-08-09', 120), // Sunday, in week
      entry('2026-08-10', 300), // next Monday, out of week
      entry('2026-07-27', 300), // previous week, out of week
    ];
    const result = summarizeWeek(entries, new Date(2026, 7, 5));
    expect(result.sessions).toBe(3);
    expect(result.minutes).toBe(17); // (300+600+120)/60 = 17
  });

  it('returns zeros when there are no entries', () => {
    expect(summarizeWeek([], new Date(2026, 7, 5))).toEqual({ sessions: 0, minutes: 0 });
  });
});

describe('computeStreak', () => {
  it('counts consecutive days ending today', () => {
    const today = new Date(2026, 7, 5);
    const entries = [entry('2026-08-05'), entry('2026-08-04'), entry('2026-08-03')];
    expect(computeStreak(entries, today)).toBe(3);
  });

  it('keeps yesterday\'s streak alive if today has no entry yet', () => {
    const today = new Date(2026, 7, 5);
    const entries = [entry('2026-08-04'), entry('2026-08-03')];
    expect(computeStreak(entries, today)).toBe(2);
  });

  it('stops at the first gap', () => {
    const today = new Date(2026, 7, 5);
    const entries = [entry('2026-08-05'), entry('2026-08-03')]; // gap on 08-04
    expect(computeStreak(entries, today)).toBe(1);
  });

  it('is 0 when there is no recent activity', () => {
    const today = new Date(2026, 7, 5);
    expect(computeStreak([entry('2026-07-01')], today)).toBe(0);
  });
});
