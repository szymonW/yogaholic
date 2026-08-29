import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { storage } from './storage';
import { toISODate } from '@/utils/history';

// Clamp bounds ported 1:1 from the mockup's incGoalSessions/decGoalMinutes etc.
const DAY_SESSIONS_MIN = 0;
const DAY_SESSIONS_MAX = 5;
const MINUTES_MIN = 5;
const MINUTES_MAX = 600;
const MINUTES_STEP = 5;

// Per-day session targets, Mon–Sun — matches the calendar's Pn–Nd week order.
// Starts at all zeros: a fresh install has no goals set yet.
const DEFAULT_SESSIONS_PER_DAY = [0, 0, 0, 0, 0, 0, 0];

/**
 * A goal change only ever applies from the day it was made onward — the calendar's past record
 * of met/missed goals must never shift retroactively just because today's target changed. So the
 * store keeps a timeline of goal snapshots (each effective from `sinceISO` onward) instead of a
 * single current value; `resolveSessionsPerDay`/`getSessionGoalForDate` look up whichever snapshot
 * was in effect on a given date.
 */
export interface GoalHistoryEntry {
  sinceISO: string;
  sessionsPerDay: number[];
}

interface GoalsState {
  goalHistory: GoalHistoryEntry[];
  goalMinutes: number;
  incSessionDay: (day: number) => void;
  decSessionDay: (day: number) => void;
  incGoalMinutes: () => void;
  decGoalMinutes: () => void;
}

/** Replaces today's snapshot if one already exists, otherwise appends a new one. */
function upsertToday(goalHistory: GoalHistoryEntry[], sessionsPerDay: number[]): GoalHistoryEntry[] {
  const todayISO = toISODate(new Date());
  const last = goalHistory[goalHistory.length - 1];
  const withoutToday = last.sinceISO === todayISO ? goalHistory.slice(0, -1) : goalHistory;
  return [...withoutToday, { sinceISO: todayISO, sessionsPerDay }];
}

export const useGoalsStore = create<GoalsState>()(
  persist(
    (set) => ({
      goalHistory: [{ sinceISO: '1970-01-01', sessionsPerDay: DEFAULT_SESSIONS_PER_DAY }],
      goalMinutes: 60,
      incSessionDay: (day) =>
        set((state) => {
          const current = [...state.goalHistory[state.goalHistory.length - 1].sessionsPerDay];
          current[day] = Math.min(DAY_SESSIONS_MAX, current[day] + 1);
          return { goalHistory: upsertToday(state.goalHistory, current) };
        }),
      decSessionDay: (day) =>
        set((state) => {
          const current = [...state.goalHistory[state.goalHistory.length - 1].sessionsPerDay];
          current[day] = Math.max(DAY_SESSIONS_MIN, current[day] - 1);
          return { goalHistory: upsertToday(state.goalHistory, current) };
        }),
      incGoalMinutes: () => set((state) => ({ goalMinutes: Math.min(MINUTES_MAX, state.goalMinutes + MINUTES_STEP) })),
      decGoalMinutes: () => set((state) => ({ goalMinutes: Math.max(MINUTES_MIN, state.goalMinutes - MINUTES_STEP) })),
    }),
    { name: 'yogaholic/goals', storage }
  )
);

/** The per-weekday goal snapshot in effect on `dateISO` — the latest one whose `sinceISO` isn't after it. */
export function resolveSessionsPerDay(goalHistory: GoalHistoryEntry[], dateISO: string): number[] {
  let result = goalHistory[0].sessionsPerDay;
  for (const entry of goalHistory) {
    if (entry.sinceISO <= dateISO) result = entry.sessionsPerDay;
    else break;
  }
  return result;
}

/** The session goal for `date`'s weekday, as it stood on that specific date (never today's). */
export function getSessionGoalForDate(goalHistory: GoalHistoryEntry[], date: Date): number {
  const sessionsPerDay = resolveSessionsPerDay(goalHistory, toISODate(date));
  const weekdayIndex = (date.getDay() + 6) % 7;
  return sessionsPerDay[weekdayIndex];
}
