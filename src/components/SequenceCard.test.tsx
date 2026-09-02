import { fireEvent, render, screen } from '@testing-library/react-native';
import { useSettingsStore } from '@/store';
import { SequenceCard } from './SequenceCard';

describe('SequenceCard', () => {
  // The assertions below are on Polish copy, so pin the UI language instead of inheriting
  // whatever detectInitialLanguage() makes of the test machine's device locale.
  beforeEach(() => {
    useSettingsStore.setState({ language: 'pl' });
  });

  it('renders title, subtitle and calls onStart/onOpenDetail', async () => {
    const onStart = jest.fn();
    const onOpenDetail = jest.fn();
    await render(
      <SequenceCard
        title="Poranne przebudzenie"
        subtitle="5 pozycji • 3:35 łącznie"
        onStart={onStart}
        onOpenDetail={onOpenDetail}
        isEditable={false}
      />
    );

    expect(screen.getByText('Poranne przebudzenie')).toBeTruthy();
    expect(screen.getByText('5 pozycji • 3:35 łącznie')).toBeTruthy();

    await fireEvent.press(screen.getByText('Start'));
    expect(onStart).toHaveBeenCalledTimes(1);

    await fireEvent.press(screen.getByText('Szczegóły'));
    expect(onOpenDetail).toHaveBeenCalledTimes(1);
  });

  it('labels the secondary action "Edytuj" only when the sequence is editable', async () => {
    const { rerender } = await render(
      <SequenceCard title="A" subtitle="s" onStart={jest.fn()} onOpenDetail={jest.fn()} isEditable={false} />
    );
    expect(screen.getByText('Szczegóły')).toBeTruthy();
    expect(screen.queryByText('Edytuj')).toBeNull();

    await rerender(<SequenceCard title="A" subtitle="s" onStart={jest.fn()} onOpenDetail={jest.fn()} isEditable />);
    expect(screen.getByText('Edytuj')).toBeTruthy();
    expect(screen.queryByText('Szczegóły')).toBeNull();
  });

  it('shows the last-practiced label only when provided', async () => {
    const { rerender } = await render(
      <SequenceCard title="A" subtitle="s" onStart={jest.fn()} onOpenDetail={jest.fn()} isEditable={false} />
    );
    expect(screen.queryByText(/Ostatnio:/)).toBeNull();

    await rerender(
      <SequenceCard title="A" subtitle="s" lastLabel="wczoraj" onStart={jest.fn()} onOpenDetail={jest.fn()} isEditable={false} />
    );
    expect(screen.getByText('Ostatnio: wczoraj')).toBeTruthy();
  });

  it('shows the delete button only when onDelete is provided, and calls it', async () => {
    const onDelete = jest.fn();
    const { rerender } = await render(
      <SequenceCard title="A" subtitle="s" onStart={jest.fn()} onOpenDetail={jest.fn()} isEditable={false} />
    );
    expect(screen.queryByLabelText('Usuń A')).toBeNull();

    await rerender(
      <SequenceCard title="A" subtitle="s" onStart={jest.fn()} onOpenDetail={jest.fn()} isEditable={false} onDelete={onDelete} />
    );
    await fireEvent.press(screen.getByLabelText('Usuń A'));
    expect(onDelete).toHaveBeenCalledTimes(1);
  });
});
