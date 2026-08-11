import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { EXERCISE_POOL } from '@/data/exercisePool';
import type { Exercise } from '@/types';
import { storage } from './storage';

interface ExercisePoolState {
  customExercises: Exercise[];
  addExercise: (exercise: Exercise) => void;
  updateExerciseDuration: (index: number, duration: number) => void;
  removeExercise: (index: number) => void;
}

export const useExercisePoolStore = create<ExercisePoolState>()(
  persist(
    (set) => ({
      customExercises: [],
      addExercise: (exercise) => set((state) => ({ customExercises: [...state.customExercises, exercise] })),
      updateExerciseDuration: (index, duration) =>
        set((state) => ({
          customExercises: state.customExercises.map((exercise, i) => (i === index ? { ...exercise, duration } : exercise)),
        })),
      removeExercise: (index) =>
        set((state) => ({ customExercises: state.customExercises.filter((_, i) => i !== index) })),
    }),
    { name: 'yogaholic/exercise-pool', storage }
  )
);

/** Pure selector so picker logic is trivial to unit test. */
export function selectAllExercises(state: { customExercises: Exercise[] }): Exercise[] {
  return [...EXERCISE_POOL, ...state.customExercises];
}
