import { useGoalsStore } from './goalsStore';

beforeEach(() => {
  useGoalsStore.setState({ goalSessions: 4, goalMinutes: 60 });
});

describe('useGoalsStore', () => {
  it('increments and decrements goalSessions', () => {
    useGoalsStore.getState().incGoalSessions();
    expect(useGoalsStore.getState().goalSessions).toBe(5);
    useGoalsStore.getState().decGoalSessions();
    useGoalsStore.getState().decGoalSessions();
    expect(useGoalsStore.getState().goalSessions).toBe(3);
  });

  it('clamps goalSessions to [1, 14]', () => {
    useGoalsStore.setState({ goalSessions: 14 });
    useGoalsStore.getState().incGoalSessions();
    expect(useGoalsStore.getState().goalSessions).toBe(14);

    useGoalsStore.setState({ goalSessions: 1 });
    useGoalsStore.getState().decGoalSessions();
    expect(useGoalsStore.getState().goalSessions).toBe(1);
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
