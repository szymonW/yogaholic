import { useGoalsStore } from './goalsStore';

beforeEach(() => {
  useGoalsStore.setState({ sessionsPerDay: [1, 1, 0, 1, 1, 0, 1], goalMinutes: 60 });
});

describe('useGoalsStore', () => {
  it('increments and decrements a single day, leaving the others untouched', () => {
    useGoalsStore.getState().incSessionDay(2);
    expect(useGoalsStore.getState().sessionsPerDay).toEqual([1, 1, 1, 1, 1, 0, 1]);

    useGoalsStore.getState().decSessionDay(0);
    expect(useGoalsStore.getState().sessionsPerDay).toEqual([0, 1, 1, 1, 1, 0, 1]);
  });

  it('clamps a day to [0, 5]', () => {
    useGoalsStore.setState({ sessionsPerDay: [0, 1, 0, 1, 1, 0, 1] });
    useGoalsStore.getState().decSessionDay(0);
    expect(useGoalsStore.getState().sessionsPerDay[0]).toBe(0);

    useGoalsStore.setState({ sessionsPerDay: [5, 1, 0, 1, 1, 0, 1] });
    useGoalsStore.getState().incSessionDay(0);
    expect(useGoalsStore.getState().sessionsPerDay[0]).toBe(5);
  });

  it('steps goalMinutes by 5 and clamps to [5, 600]', () => {
    useGoalsStore.getState().incGoalMinutes();
    expect(useGoalsStore.getState().goalMinutes).toBe(65);

    useGoalsStore.setState({ goalMinutes: 600 });
    useGoalsStore.getState().incGoalMinutes();
    expect(useGoalsStore.getState().goalMinutes).toBe(600);

    useGoalsStore.setState({ goalMinutes: 5 });
    useGoalsStore.getState().decGoalMinutes();
    expect(useGoalsStore.getState().goalMinutes).toBe(5);
  });
});
