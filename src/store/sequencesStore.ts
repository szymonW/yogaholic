import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BASE_SEQUENCES, CUSTOM_SEEDS } from '@/data/sampleSequences';
import type { Exercise, Sequence, SequenceCategory } from '@/types';
import { storage } from './storage';

interface SequencesState {
  /** User-created sequences. Seeded with starter content, then fully mutable. */
  customSequences: Sequence[];
  /** Most recently started sequence ids, newest first, capped at 5. Real usage only — not seeded. */
  recentIds: string[];
  /** User-favorited sequence ids (base or custom), newest first. Not seeded. */
  favoriteIds: string[];
  getById: (id: string) => Sequence | undefined;
  addCustomSequence: (input: { title: string; exercises: Exercise[] }) => Sequence;
  updateCustomSequence: (id: string, input: { title: string; exercises: Exercise[] }) => void;
  removeCustomSequence: (id: string) => void;
  pushRecent: (id: string) => void;
  toggleFavorite: (id: string) => void;
}

export const useSequencesStore = create<SequencesState>()(
  persist(
    (set, get) => ({
      customSequences: CUSTOM_SEEDS,
      recentIds: [],
      favoriteIds: [],

      getById: (id) => BASE_SEQUENCES.find((sequence) => sequence.id === id) ?? get().customSequences.find((sequence) => sequence.id === id),

      addCustomSequence: ({ title, exercises }) => {
        const sequence: Sequence = { id: `c${Date.now()}`, title, exercises };
        set((state) => ({ customSequences: [...state.customSequences, sequence] }));
        return sequence;
      },

      updateCustomSequence: (id, { title, exercises }) => {
        set((state) => ({
          customSequences: state.customSequences.map((sequence) => (sequence.id === id ? { ...sequence, title, exercises } : sequence)),
        }));
      },

      removeCustomSequence: (id) => {
        set((state) => ({ customSequences: state.customSequences.filter((sequence) => sequence.id !== id) }));
      },

      pushRecent: (id) => {
        set((state) => ({ recentIds: [id, ...state.recentIds.filter((r) => r !== id)].slice(0, 5) }));
      },

      toggleFavorite: (id) => {
        set((state) => ({
          favoriteIds: state.favoriteIds.includes(id)
            ? state.favoriteIds.filter((favoriteId) => favoriteId !== id)
            : [id, ...state.favoriteIds],
        }));
      },
    }),
    { name: 'yogaholic/sequences', storage }
  )
);

/** Pure selector (no store dependency) so category logic is trivial to unit test. */
export function selectSequencesForCategory(
  category: SequenceCategory,
  state: { customSequences: Sequence[]; recentIds: string[]; favoriteIds: string[] }
): Sequence[] {
  switch (category) {
    case 'recent':
      return state.recentIds
        .map((id) => BASE_SEQUENCES.find((sequence) => sequence.id === id) ?? state.customSequences.find((sequence) => sequence.id === id))
        .filter((sequence): sequence is Sequence => Boolean(sequence));
    case 'saved':
      return state.favoriteIds
        .map((id) => BASE_SEQUENCES.find((sequence) => sequence.id === id) ?? state.customSequences.find((sequence) => sequence.id === id))
        .filter((sequence): sequence is Sequence => Boolean(sequence));
    case 'sample':
      return BASE_SEQUENCES.filter((sequence) => sequence.tags?.includes('sample'));
    case 'custom':
      return state.customSequences;
  }
}
