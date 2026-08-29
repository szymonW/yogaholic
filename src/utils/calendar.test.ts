import type { DayEvent, HistoryEntry } from '@/types';
import {
  formatShortDate,
  getDoneDaysInMonth,
  getEventBlockPosition,
  getHourLabels,
  getMonthCells,
  getMonthLabel,
  getWeekDays,
  historyToDayEvents,
} from './calendar';

const historyEntry = (dateISO: string, hour: number, minute: number, durationSeconds: number, sequenceId = 's1'): HistoryEntry => {
  const [year, month, day] = dateISO.split('-').map(Number);
  const startedAtMs = new Date(year, month - 1, day, hour, minute).getTime();
  return { id: `${sequenceId}-${dateISO}`, sequenceId, dateISO, startedAtMs, durationSeconds, exerciseCount: 4 };
};

/** Test helper: a flat Mon–Sun goal array as a `getSessionGoal(date)` callback, ignoring history. */
const flatGoal = (sessionsPerDay: number[]) => (date: Date) => sessionsPerDay[(date.getDay() + 6) % 7];

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

  it('flags no day as today when the anchor week does not contain the real today', () => {
    const anchor = new Date(2026, 6, 29); // a week before today
    const realToday = new Date(2026, 7, 5);
    const days = getWeekDays(anchor, new Map(), 3, realToday);
    expect(days.some((d) => d.isToday)).toBe(false);
  });

  it('flags the real today even when it sits away from the anchor-centered window', () => {
    const anchor = new Date(2026, 7, 6);
    const realToday = new Date(2026, 7, 5);
    const days = getWeekDays(anchor, new Map(), 3, realToday);
    expect(days.find((d) => d.isToday)?.iso).toBe('2026-08-05');
  });

  it('flags a past, event-less day as missedGoal only when that weekday has a nonzero goal', () => {
    const today = new Date(2026, 7, 5); // Wednesday
    // Mon..Sun: Monday has a goal of 1, every other day is 0.
    const days = getWeekDays(today, new Map(), 3, today, flatGoal([1, 0, 0, 0, 0, 0, 0]));
    const monday = days.find((d) => d.letter === 'Pn');
    const tuesday = days.find((d) => d.letter === 'Wt');
    expect(monday?.missedGoal).toBe(true);
    expect(tuesday?.missedGoal).toBe(false);
  });

  it('does not flag missedGoal for a day with a logged session, or for today/future days', () => {
    const today = new Date(2026, 7, 5); // Wednesday
    const events = new Map([['2026-08-03', [{ hour: 7, minute: 0, durationMinutes: 30, status: 'done' as const }]]]);
    const days = getWeekDays(today, events, 3, today, flatGoal([1, 1, 1, 1, 1, 1, 1]));
    const monday = days.find((d) => d.letter === 'Pn'); // has a logged session
    const wednesday = days.find((d) => d.letter === 'Śr'); // today
    const thursday = days.find((d) => d.letter === 'Cz'); // future
    expect(monday?.missedGoal).toBe(false);
    expect(wednesday?.missedGoal).toBe(false);
    expect(thursday?.missedGoal).toBe(false);
  });
});

describe('formatShortDate', () => {
  it('formats a day and abbreviated Polish month', () => {
    expect(formatShortDate(new Date(2026, 7, 5))).toBe('5 sie');
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

  it('marks today as "todayDone" (not plain "today") once a session was logged today', () => {
    const today = new Date(2026, 7, 5);
    const cells = getMonthCells(today, new Set([5]), new Set());
    const byDay = new Map(cells.filter((c) => c.day !== null).map((c) => [c.day, c.state]));
    expect(byDay.get(5)).toBe('todayDone');
  });

  it('has one cell per day of the month plus leading padding', () => {
    const cells = getMonthCells(new Date(2026, 7, 5), new Set(), new Set());
    const dayCells = cells.filter((c) => c.day !== null);
    expect(dayCells).toHaveLength(31); // August has 31 days
  });

  it('treats every day as past (done/missed) in a month before the real today, with no "today" cell', () => {
    const viewedMonth = new Date(2026, 6, 1); // July, one month before real today
    const realToday = new Date(2026, 7, 5);
    const cells = getMonthCells(viewedMonth, new Set([3]), new Set(), realToday);
    const dayCells = cells.filter((c) => c.day !== null);
    expect(dayCells.some((c) => c.state === 'today' || c.state === 'todayDone')).toBe(false);
    expect(dayCells.some((c) => c.state === 'rest' || c.state === 'planned')).toBe(false);
    const byDay = new Map(dayCells.map((c) => [c.day, c.state]));
    expect(byDay.get(3)).toBe('done');
    expect(byDay.get(4)).toBe('missed');
  });

  it('flags a past non-done day as "missedGoal" only when its weekday has a nonzero goal', () => {
    const today = new Date(2026, 7, 5); // Wednesday; 2026-08-03 is Monday, 2026-08-04 is Tuesday
    const cells = getMonthCells(today, new Set(), new Set(), today, flatGoal([1, 0, 0, 0, 0, 0, 0]));
    const byDay = new Map(cells.filter((c) => c.day !== null).map((c) => [c.day, c.state]));
    expect(byDay.get(3)).toBe('missedGoal'); // Monday, no goal met
    expect(byDay.get(4)).toBe('missed'); // Tuesday, no goal at all
  });

  it('does not mark a done day as missedGoal even when its weekday has a goal', () => {
    const today = new Date(2026, 7, 5);
    const cells = getMonthCells(today, new Set([3]), new Set(), today, flatGoal([1, 0, 0, 0, 0, 0, 0]));
    const byDay = new Map(cells.filter((c) => c.day !== null).map((c) => [c.day, c.state]));
    expect(byDay.get(3)).toBe('done');
  });
});

describe('historyToDayEvents', () => {
  it('converts each entry into a "done" DayEvent keyed by its date', () => {
    const entries = [historyEntry('2026-08-05', 7, 30, 300)];
    const map = historyToDayEvents(entries);
    expect(map.get('2026-08-05')).toEqual([{ hour: 7, minute: 30, durationMinutes: 5, status: 'done' }]);
  });

  it('groups multiple sessions on the same day', () => {
    const entries = [historyEntry('2026-08-05', 7, 0, 300), historyEntry('2026-08-05', 18, 0, 600)];
    expect(historyToDayEvents(entries).get('2026-08-05')).toHaveLength(2);
  });

  it('skips entries with a missing/invalid startedAtMs instead of producing NaN events', () => {
    const legacyEntry: HistoryEntry = {
      id: 'h1',
      sequenceId: 's1',
      dateISO: '2026-08-05',
      startedAtMs: NaN,
      durationSeconds: 300,
      exerciseCount: 4,
    };
    expect(historyToDayEvents([legacyEntry]).get('2026-08-05')).toBeUndefined();
  });
});

describe('getDoneDaysInMonth', () => {
  it('only counts entries within today\'s month', () => {
    const today = new Date(2026, 7, 5);
    const entries = [historyEntry('2026-08-01', 7, 0, 300), historyEntry('2026-08-04', 7, 0, 300), historyEntry('2026-07-31', 7, 0, 300)];
    expect(getDoneDaysInMonth(entries, today)).toEqual(new Set([1, 4]));
  });
});

describe('getHourLabels', () => {
  it('spaces labels using a step that keeps at most 5 of them', () => {
    const labels = getHourLabels(6, 22, 11);
    expect(labels.map((l) => l.label)).toEqual(['6:00', '10:00', '14:00', '18:00', '22:00']);
    expect(labels[1].topPx).toBe(44); // (10-6)*11
  });

  it('always includes the start hour even for a narrow range', () => {
    const labels = getHourLabels(9, 10, 11);
    expect(labels[0]).toEqual({ label: '9:00', topPx: 0 });
  });
});

describe('getEventBlockPosition', () => {
  it('positions a block from its hour/minute offset and duration', () => {
    const event: DayEvent = { hour: 8, minute: 30, durationMinutes: 30, status: 'done' };
    expect(getEventBlockPosition(event, 7, 11)).toEqual({ topPx: 16.5, heightPx: 9 });
  });

  it('enforces a minimum visible height for very short sessions', () => {
    const event: DayEvent = { hour: 7, minute: 0, durationMinutes: 5, status: 'done' };
    expect(getEventBlockPosition(event, 7, 11).heightPx).toBe(9);
  });
});
