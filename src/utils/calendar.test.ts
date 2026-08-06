import type { DayEvent } from '@/types';
import { computeHourRange, getMonthCells, getMonthLabel, getWeekDays } from './calendar';

describe('getWeekDays', () => {
  it('returns 2*radius+1 days centered on today with correct letters', () => {
    const wednesday = new Date(2026, 7, 5); // Wednesday
    const days = getWeekDays(wednesday, new Map());
    expect(days).toHaveLength(7);
    expect(days[3].isToday).toBe(true);
    expect(days[3].letter).toBe('Śr');
    expect(days.filter((d) => d.isToday)).toHaveLength(1);
  });

  it('attaches events by ISO date', () => {
    const today = new Date(2026, 7, 5);
    const events: DayEvent[] = [{ hour: 7, minute: 0, durationMinutes: 30, status: 'done' }];
    const map = new Map([['2026-08-05', events]]);
    const days = getWeekDays(today, map);
    expect(days[3].events).toEqual(events);
    expect(days[0].events).toEqual([]);
  });

  it('supports a custom radius', () => {
    const today = new Date(2026, 7, 5);
    expect(getWeekDays(today, new Map(), 1)).toHaveLength(3);
  });
});

describe('computeHourRange', () => {
  it('falls back to 7-20 when there are no events', () => {
    expect(computeHourRange([])).toEqual({ start: 7, end: 20 });
  });

  it('pads the range around the events and clamps to bounds', () => {
    const events: DayEvent[] = [
      { hour: 8, minute: 0, durationMinutes: 30, status: 'done' },
      { hour: 18, minute: 30, durationMinutes: 30, status: 'planned' },
    ];
    expect(computeHourRange(events)).toEqual({ start: 7, end: 20 });
  });

  it('clamps to minStart/maxEnd', () => {
    const events: DayEvent[] = [{ hour: 5, minute: 0, durationMinutes: 2000, status: 'done' }];
    expect(computeHourRange(events, 6, 22)).toEqual({ start: 6, end: 22 });
  });
});

describe('getMonthLabel', () => {
  it('formats the Polish month name and year', () => {
    expect(getMonthLabel(new Date(2026, 7, 5))).toBe('Sierpień 2026');
  });
});

describe('getMonthCells', () => {
  it('pads leading empty cells so the first day lands on the right weekday column', () => {
    // 2026-08-01 is a Saturday -> Monday-start offset of 5 empty cells
    const cells = getMonthCells(new Date(2026, 7, 5), new Set(), new Set());
    expect(cells.slice(0, 5).every((c) => c.state === 'empty')).toBe(true);
    expect(cells[5]).toEqual({ day: 1, state: 'missed' });
  });

  it('marks today, done/missed past days and rest/planned future days', () => {
    const today = new Date(2026, 7, 5);
    const cells = getMonthCells(today, new Set([1, 2]), new Set([10]));
    const byDay = new Map(cells.filter((c) => c.day !== null).map((c) => [c.day, c.state]));
    expect(byDay.get(1)).toBe('done');
    expect(byDay.get(2)).toBe('done');
    expect(byDay.get(3)).toBe('missed');
    expect(byDay.get(5)).toBe('today');
    expect(byDay.get(10)).toBe('planned');
    expect(byDay.get(11)).toBe('rest');
  });

  it('has one cell per day of the month plus leading padding', () => {
    const cells = getMonthCells(new Date(2026, 7, 5), new Set(), new Set());
    const dayCells = cells.filter((c) => c.day !== null);
    expect(dayCells).toHaveLength(31); // August has 31 days
  });
});
