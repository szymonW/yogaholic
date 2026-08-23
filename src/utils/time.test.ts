import { formatDuration, formatDurationPadded, totalDuration } from './time';

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

describe('formatDurationPadded', () => {
  it('zero-pads both minutes and seconds', () => {
    expect(formatDurationPadded(0)).toBe('00:00');
    expect(formatDurationPadded(95)).toBe('01:35');
  });

  it('does not pad minutes at or above 10', () => {
    expect(formatDurationPadded(605)).toBe('10:05');
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
