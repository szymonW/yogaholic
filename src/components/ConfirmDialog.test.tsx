import { fireEvent, render, screen } from '@testing-library/react-native';
import { useSettingsStore } from '@/store';
import { ConfirmDialog } from './ConfirmDialog';

describe('ConfirmDialog', () => {
  // The default confirm/cancel labels come from the catalog, so pin the UI language instead of
  // inheriting whatever detectInitialLanguage() makes of the test machine's device locale.
  beforeEach(() => {
    useSettingsStore.setState({ language: 'pl' });
  });

  it('renders title/message and calls onConfirm/onCancel', async () => {
    const onConfirm = jest.fn();
    const onCancel = jest.fn();
    await render(
      <ConfirmDialog visible title="Usunąć sekwencję?" message="Tej operacji nie można cofnąć." onConfirm={onConfirm} onCancel={onCancel} />
    );

    expect(screen.getByText('Usunąć sekwencję?')).toBeTruthy();
    expect(screen.getByText('Tej operacji nie można cofnąć.')).toBeTruthy();

    await fireEvent.press(screen.getByText('Usuń'));
    expect(onConfirm).toHaveBeenCalledTimes(1);

    await fireEvent.press(screen.getByText('Anuluj'));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('renders nothing visible when not visible', async () => {
    await render(<ConfirmDialog visible={false} title="X" onConfirm={jest.fn()} onCancel={jest.fn()} />);
    expect(screen.queryByText('X')).toBeNull();
  });

  it('uses custom confirm/cancel labels when provided', async () => {
    await render(
      <ConfirmDialog visible title="X" confirmLabel="Tak, usuń" cancelLabel="Nie teraz" onConfirm={jest.fn()} onCancel={jest.fn()} />
    );
    expect(screen.getByText('Tak, usuń')).toBeTruthy();
    expect(screen.getByText('Nie teraz')).toBeTruthy();
  });
});
