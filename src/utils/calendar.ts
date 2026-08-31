import type { DayEvent, HistoryEntry } from '@/types';
import { addDays, parseISODate, toISODate } from './history';

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

const MONTH_NAMES_SHORT_PL = ['sty', 'lut', 'mar', 'kwi', 'maj', 'cze', 'lip', 'sie', 'wrz', 'paź', 'lis', 'gru'];

export interface WeekDayInfo {
  date: Date;
  iso: string;
  letter: string;
  dayNumber: number;
  isToday: boolean;
  events: DayEvent[];
  /** Past day with a session goal (see `getSessionGoal`) that wasn't met. */
  missedGoal: boolean;
}

/**
 * `anchor` ± `radius` days, mirroring the mockup's 7-day week strip. `today` (defaults to
 * `anchor`) is the real current date, used only to flag which day (if any) is "today" — pass
 * it explicitly when `anchor` has been moved to a past week so an arbitrary day in that window
 * doesn't get mislabeled as today. `getSessionGoal` (from the goals screen) returns the session
 * goal that was in effect *on that specific date* — a later goal change must never retroactively
 * relabel an earlier day — and flags a past, event-less day as a missed goal only when it's nonzero.
 */
export function getWeekDays(
  anchor: Date,
  eventsByISODate: Map<string, DayEvent[]>,
  radius = 3,
  today: Date = anchor,
  getSessionGoal: (date: Date) => number = () => 0
): WeekDayInfo[] {
  const todayISO = toISODate(today);
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const days: WeekDayInfo[] = [];
  for (let offset = -radius; offset <= radius; offset++) {
    const date = addDays(anchor, offset);
    const iso = toISODate(date);
    const events = eventsByISODate.get(iso) ?? [];
    days.push({
      date,
      iso,
      letter: WEEKDAY_LETTERS_PL[(date.getDay() + 6) % 7],
      dayNumber: date.getDate(),
      isToday: iso === todayISO,
      events,
      missedGoal: date.getTime() < startOfToday && events.length === 0 && getSessionGoal(date) > 0,
    });
  }
  return days;
}

/** "5 sie" — a short day+month label for a week's date range. */
export function formatShortDate(date: Date): string {
  return `${date.getDate()} ${MONTH_NAMES_SHORT_PL[date.getMonth()]}`;
}

export type MonthCellState = 'empty' | 'today' | 'todayDone' | 'done' | 'missed' | 'missedGoal' | 'planned' | 'rest';

export interface MonthCell {
  day: number | null;
  state: MonthCellState;
}

export function getMonthLabel(today: Date): string {
  return `${MONTH_NAMES_PL[today.getMonth()]} ${today.getFullYear()}`;
}

/**
 * Renders `viewedMonth`'s grid. `today` (defaults to `viewedMonth`) is the real current date —
 * pass it explicitly once `viewedMonth` has been navigated away from the current month, so
 * "today"/past/future is judged against the real date rather than the viewed month's own days.
 * `getSessionGoal` (from the goals screen) returns the session goal that was in effect *on that
 * specific date* — a later goal change must never retroactively relabel an earlier day. A past,
 * non-done day reads as plain "missed" (unmarked) when that goal was 0, or "missedGoal" (flagged)
 * when it wasn't.
 */
export function getMonthCells(
  viewedMonth: Date,
  doneDays: Set<number>,
  plannedDays: Set<number>,
  today: Date = viewedMonth,
  getSessionGoal: (date: Date) => number = () => 0
): MonthCell[] {
  const year = viewedMonth.getFullYear();
  const month = viewedMonth.getMonth();
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();
  const todayDay = isCurrentMonth ? today.getDate() : -1;
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const startOffset = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: MonthCell[] = [];
  for (let i = 0; i < startOffset; i++) cells.push({ day: null, state: 'empty' });
  for (let day = 1; day <= daysInMonth; day++) {
    let state: MonthCellState;
    const date = new Date(year, month, day);
    if (day === todayDay) state = doneDays.has(day) ? 'todayDone' : 'today';
    else if (date.getTime() < startOfToday) {
      if (doneDays.has(day)) state = 'done';
      else state = getSessionGoal(date) > 0 ? 'missedGoal' : 'missed';
    } else state = plannedDays.has(day) ? 'planned' : 'rest';
    cells.push({ day, state });
  }
  return cells;
}

/** Buckets completed sessions by their calendar date, as "done" DayEvents for the week grid. */
export function historyToDayEvents(entries: HistoryEntry[]): Map<string, DayEvent[]> {
  const map = new Map<string, DayEvent[]>();
  for (const entry of entries) {
    const startedAt = new Date(entry.startedAtMs);
    if (Number.isNaN(startedAt.getTime())) continue; // guards against malformed/legacy persisted data
    const event: DayEvent = {
      hour: startedAt.getHours(),
      minute: startedAt.getMinutes(),
      durationMinutes: entry.durationSeconds / 60,
      status: 'done',
    };
    const existing = map.get(entry.dateISO);
    if (existing) existing.push(event);
    else map.set(entry.dateISO, [event]);
  }
  return map;
}

/** Day-of-month numbers (within `today`'s month) that have at least one completed session. */
export function getDoneDaysInMonth(entries: HistoryEntry[], today: Date): Set<number> {
  const year = today.getFullYear();
  const month = today.getMonth();
  const days = new Set<number>();
  for (const entry of entries) {
    const date = parseISODate(entry.dateISO);
    if (date.getFullYear() === year && date.getMonth() === month) days.add(date.getDate());
  }
  return days;
}

export interface HourLabel {
  label: string;
  topPx: number;
}

/** Up to 5 evenly-spaced "H:00" labels for the hour grid's left gutter. */
export function getHourLabels(start: number, end: number, rowHeightPx: number): HourLabel[] {
  const step = Math.max(1, Math.ceil((end - start) / 4));
  const labels: HourLabel[] = [];
  for (let hour = start; hour <= end; hour += step) {
    labels.push({ label: `${hour}:00`, topPx: (hour - start) * rowHeightPx });
  }
  return labels;
}

/** Pixel position of an event block within an hour-grid column starting at `hourStart`. */
export function getEventBlockPosition(event: DayEvent, hourStart: number, rowHeightPx: number): { topPx: number; heightPx: number } {
  const topPx = (event.hour + event.minute / 60 - hourStart) * rowHeightPx;
  const heightPx = Math.max(9, (event.durationMinutes / 60) * rowHeightPx);
  return { topPx, heightPx };
}
