import { EXERCISE_POOL } from '@/data/exercisePool';
import { selectAllExercises, useExercisePoolStore } from './exercisePoolStore';

beforeEach(() => {
  useExercisePoolStore.setState({ customExercises: [] });
});

describe('useExercisePoolStore', () => {
  it('starts with no custom exercises', () => {
    expect(useExercisePoolStore.getState().customExercises).toEqual([]);
  });

  it('addExercise appends to customExercises', () => {
    useExercisePoolStore.getState().addExercise({ name: 'Nowa pozycja', duration: 20 });
    expect(useExercisePoolStore.getState().customExercises).toEqual([{ name: 'Nowa pozycja', duration: 20 }]);
  });
});

describe('selectAllExercises', () => {
  it('combines the seed pool with custom exercises', () => {
    const custom = [{ name: 'Nowa pozycja', duration: 20 }];
    const result = selectAllExercises({ customExercises: custom });
    expect(result).toHaveLength(EXERCISE_POOL.length + 1);
    expect(result.at(-1)).toEqual(custom[0]);
  });
});
