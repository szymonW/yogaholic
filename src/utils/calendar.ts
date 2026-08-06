import type { DayEvent } from '@/types';
import { addDays, toISODate } from './history';

export const WEEKDAY_LETTERS_PL = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'];

const MONTH_NAMES_PL = [
  'Styczeń',
  'Luty',
  'Marzec',
  'Kwiecień',
  'Maj',
  'Czerwiec',
  'Lipiec',
  'Sierpień',
  'Wrzesień',
  'Październik',
  'Listopad',
  'Grudzień',
];

export interface WeekDayInfo {
  date: Date;
  iso: string;
  letter: string;
  dayNumber: number;
  isToday: boolean;
  events: DayEvent[];
}

/** `today` ± `radius` days, mirroring the mockup's 7-day week strip. */
export function getWeekDays(today: Date, eventsByISODate: Map<string, DayEvent[]>, radius = 3): WeekDayInfo[] {
  const days: WeekDayInfo[] = [];
  for (let offset = -radius; offset <= radius; offset++) {
    const date = addDays(today, offset);
    const iso = toISODate(date);
    days.push({
      date,
      iso,
      letter: WEEKDAY_LETTERS_PL[(date.getDay() + 6) % 7],
      dayNumber: date.getDate(),
      isToday: offset === 0,
      events: eventsByISODate.get(iso) ?? [],
    });
  }
  return days;
}

/** Hour range to render the day grid over, padded by 1h and clamped to [minStart, maxEnd]. */
export function computeHourRange(events: DayEvent[], minStart = 6, maxEnd = 22): { start: number; end: number } {
  if (events.length === 0) return { start: 7, end: 20 };
  const starts = events.map((event) => event.hour);
  const ends = events.map((event) => event.hour + event.durationMinutes / 60);
  const start = Math.max(minStart, Math.floor(Math.min(...starts)) - 1);
  const end = Math.min(maxEnd, Math.ceil(Math.max(...ends)) + 1);
  return { start, end };
}

export type MonthCellState = 'empty' | 'today' | 'done' | 'missed' | 'planned' | 'rest';

export interface MonthCell {
  day: number | null;
  state: MonthCellState;
}

export function getMonthLabel(today: Date): string {
  return `${MONTH_NAMES_PL[today.getMonth()]} ${today.getFullYear()}`;
}

/**
 * Always renders `today`'s month (the mockup has no prev/next month navigation).
 * `doneDays`/`plannedDays` are day-of-month numbers.
 */
export function getMonthCells(today: Date, doneDays: Set<number>, plannedDays: Set<number>): MonthCell[] {
  const year = today.getFullYear();
  const month = today.getMonth();
  const todayDay = today.getDate();
  const startOffset = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: MonthCell[] = [];
  for (let i = 0; i < startOffset; i++) cells.push({ day: null, state: 'empty' });
  for (let day = 1; day <= daysInMonth; day++) {
    let state: MonthCellState;
    if (day === todayDay) state = 'today';
    else if (day < todayDay) state = doneDays.has(day) ? 'done' : 'missed';
    else state = plannedDays.has(day) ? 'planned' : 'rest';
    cells.push({ day, state });
  }
  return cells;
}
