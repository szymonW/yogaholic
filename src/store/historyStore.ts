import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { HistoryEntry } from '@/types';
import { toISODate } from '@/utils/history';
import { storage } from './storage';

interface HistoryState {
  /** One entry per completed run — feeds streak, weekly goals and the calendar's "done" days. */
  entries: HistoryEntry[];
  logSession: (input: { sequenceId: string; durationSeconds: number; exerciseCount: number; date?: Date }) => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      entries: [],
      logSession: ({ sequenceId, durationSeconds, exerciseCount, date = new Date() }) => {
        const entry: HistoryEntry = {
          id: `h${Date.now()}`,
          sequenceId,
          dateISO: toISODate(date),
          durationSeconds,
          exerciseCount,
        };
        set((state) => ({ entries: [...state.entries, entry] }));
      },
    }),
    { name: 'yogaholic/history', storage }
  )
);
