import type { HistoryEntry } from '@/types';

/** Local-time "yyyy-mm-dd", deliberately not toISOString() (which is UTC and can shift the day). */
export function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Inverse of toISODate — parsed as local midnight, not UTC (new Date("yyyy-mm-dd") parses as UTC). */
export function parseISODate(iso: string): Date {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function addDays(date: Date, delta: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + delta);
  return result;
}

/** Monday-start week bounds, matching the calendar's Pn..Nd header order. */
export function getWeekBounds(referenceDate: Date): { start: Date; end: Date } {
  const mondayOffset = (referenceDate.getDay() + 6) % 7; // 0 = Monday
  const start = addDays(referenceDate, -mondayOffset);
  start.setHours(0, 0, 0, 0);
  const end = addDays(start, 6);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

export function summarizeWeek(entries: HistoryEntry[], referenceDate: Date): { sessions: number; minutes: number } {
  const { start, end } = getWeekBounds(referenceDate);
  const inWeek = entries.filter((entry) => {
    const date = parseISODate(entry.dateISO);
    return date >= start && date <= end;
  });
  const minutes = Math.round(inWeek.reduce((sum, entry) => sum + entry.durationSeconds, 0) / 60);
  return { sessions: inWeek.length, minutes };
}

/**
 * Consecutive days with at least one completed session, walking back from `today`.
 * If nothing was logged yet today, the streak still counts yesterday's run so it
 * doesn't drop to zero the moment the clock passes midnight.
 */
export function computeStreak(entries: HistoryEntry[], today: Date): number {
  const doneDates = new Set(entries.map((entry) => entry.dateISO));
  let cursor = doneDates.has(toISODate(today)) ? today : addDays(today, -1);

  let streak = 0;
  while (doneDates.has(toISODate(cursor))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

/** Most recent completion date for a sequence, or undefined if it was never run. */
export function getLastPracticedDate(entries: HistoryEntry[], sequenceId: string): string | undefined {
  return entries
    .filter((entry) => entry.sequenceId === sequenceId)
    .map((entry) => entry.dateISO)
    .sort()
    .at(-1);
}

/** Short Polish "time ago" label for the recent-sequences list, e.g. "wczoraj", "3 dni temu". */
export function formatRelativeDays(dateISO: string, today: Date): string {
  const days = Math.round((today.getTime() - parseISODate(dateISO).getTime()) / 86_400_000);
  if (days <= 0) return 'dzisiaj';
  if (days === 1) return 'wczoraj';
  if (days < 7) return `${days} dni temu`;
  if (days < 14) return 'tydzień temu';
  if (days < 30) return `${Math.floor(days / 7)} tygodnie temu`;
  return 'miesiąc temu';
}
