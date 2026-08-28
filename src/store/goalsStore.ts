import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { storage } from './storage';

// Clamp bounds ported 1:1 from the mockup's incGoalSessions/decGoalMinutes etc.
const DAY_SESSIONS_MIN = 0;
const DAY_SESSIONS_MAX = 5;
const MINUTES_MIN = 5;
const MINUTES_MAX = 600;
const MINUTES_STEP = 5;

// Per-day session targets, Mon–Sun — matches the calendar's Pn–Nd week order.
const DEFAULT_SESSIONS_PER_DAY = [1, 1, 0, 1, 1, 0, 1];

interface GoalsState {
  sessionsPerDay: number[];
  goalMinutes: number;
  incSessionDay: (day: number) => void;
  decSessionDay: (day: number) => void;
  incGoalMinutes: () => void;
  decGoalMinutes: () => void;
}

export const useGoalsStore = create<GoalsState>()(
  persist(
    (set) => ({
      sessionsPerDay: DEFAULT_SESSIONS_PER_DAY,
      goalMinutes: 60,
      incSessionDay: (day) =>
        set((state) => {
          const sessionsPerDay = [...state.sessionsPerDay];
          sessionsPerDay[day] = Math.min(DAY_SESSIONS_MAX, sessionsPerDay[day] + 1);
          return { sessionsPerDay };
        }),
      decSessionDay: (day) =>
        set((state) => {
          const sessionsPerDay = [...state.sessionsPerDay];
          sessionsPerDay[day] = Math.max(DAY_SESSIONS_MIN, sessionsPerDay[day] - 1);
          return { sessionsPerDay };
        }),
      incGoalMinutes: () => set((state) => ({ goalMinutes: Math.min(MINUTES_MAX, state.goalMinutes + MINUTES_STEP) })),
      decGoalMinutes: () => set((state) => ({ goalMinutes: Math.max(MINUTES_MIN, state.goalMinutes - MINUTES_STEP) })),
    }),
    { name: 'yogaholic/goals', storage }
  )
);
