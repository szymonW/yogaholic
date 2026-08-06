import { formatDuration, totalDuration } from './time';

describe('formatDuration', () => {
  it('pads seconds below 10', () => {
    expect(formatDuration(95)).toBe('1:35');
    expect(formatDuration(65)).toBe('1:05');
  });

  it('handles whole minutes', () => {
    expect(formatDuration(120)).toBe('2:00');
  });

  it('handles sub-minute durations', () => {
    expect(formatDuration(45)).toBe('0:45');
    expect(formatDuration(9)).toBe('0:09');
  });
});

describe('totalDuration', () => {
  it('sums exercise durations and formats the result', () => {
    const exercises = [{ name: 'a', duration: 30 }, { name: 'b', duration: 45 }, { name: 'c', duration: 40 }];
    expect(totalDuration(exercises)).toBe('1:55');
  });

  it('returns 0:00 for an empty list', () => {
    expect(totalDuration([])).toBe('0:00');
  });
});
