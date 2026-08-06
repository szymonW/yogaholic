import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { storage } from './storage';

// Clamp bounds ported 1:1 from the mockup's incGoalSessions/decGoalMinutes etc.
const SESSIONS_MIN = 1;
const SESSIONS_MAX = 14;
const MINUTES_MIN = 5;
const MINUTES_MAX = 600;
const MINUTES_STEP = 5;

interface GoalsState {
  goalSessions: number;
  goalMinutes: number;
  incGoalSessions: () => void;
  decGoalSessions: () => void;
  incGoalMinutes: () => void;
  decGoalMinutes: () => void;
}

export const useGoalsStore = create<GoalsState>()(
  persist(
    (set) => ({
      goalSessions: 4,
      goalMinutes: 60,
      incGoalSessions: () => set((state) => ({ goalSessions: Math.min(SESSIONS_MAX, state.goalSessions + 1) })),
      decGoalSessions: () => set((state) => ({ goalSessions: Math.max(SESSIONS_MIN, state.goalSessions - 1) })),
      incGoalMinutes: () => set((state) => ({ goalMinutes: Math.min(MINUTES_MAX, state.goalMinutes + MINUTES_STEP) })),
      decGoalMinutes: () => set((state) => ({ goalMinutes: Math.max(MINUTES_MIN, state.goalMinutes - MINUTES_STEP) })),
    }),
    { name: 'yogaholic/goals', storage }
  )
);
