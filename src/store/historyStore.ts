import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { HistoryEntry } from '@/types';
import { parseISODate, toISODate } from '@/utils/history';
import { storage } from './storage';

interface HistoryState {
  /** One entry per completed run — feeds streak, weekly goals and the calendar's "done" days. */
  entries: HistoryEntry[];
  logSession: (input: { sequenceId: string; durationSeconds: number; exerciseCount: number; date?: Date }) => void;
}

// v1 added HistoryEntry.startedAtMs — backfill it for entries persisted before that field existed,
// otherwise the calendar's hour grid silently breaks (NaN propagates through its layout math).
// Exported standalone so the backfill logic is unit-testable without going through persist rehydration.
export function migrateHistoryState(persisted: unknown): HistoryState {
  const state = persisted as { entries?: (Partial<HistoryEntry> & { dateISO: string; durationSeconds: number })[] };
  if (state.entries) {
    state.entries = state.entries.map((entry) => ({
      ...entry,
      startedAtMs: entry.startedAtMs ?? parseISODate(entry.dateISO).getTime(),
    })) as HistoryEntry[];
  }
  return state as HistoryState;
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
          // We only know the completion time; approximate the start for calendar placement.
          startedAtMs: date.getTime() - durationSeconds * 1000,
          durationSeconds,
          exerciseCount,
        };
        set((state) => ({ entries: [...state.entries, entry] }));
      },
    }),
    {
      name: 'yogaholic/history',
      storage,
      version: 1,
      migrate: migrateHistoryState,
    }
  )
);
