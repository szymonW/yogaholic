import { render, screen } from '@testing-library/react-native';
import { colors } from '@/theme';
import { Toggle } from './Toggle';

function flattenBackgroundColor(style: unknown): string | undefined {
  const flat = [style].flat(Infinity) as { backgroundColor?: string }[];
  return flat.find((s) => s?.backgroundColor)?.backgroundColor;
}

describe('Toggle', () => {
  it('renders an accent-filled track when on and a border-colored track when off', async () => {
    const { rerender } = await render(<Toggle value testID="toggle" />);
    expect(flattenBackgroundColor(screen.getByTestId('toggle').props.style)).toBe(colors.accent);

    await rerender(<Toggle value={false} testID="toggle" />);
    expect(flattenBackgroundColor(screen.getByTestId('toggle').props.style)).toBe(colors.border);
  });
});
