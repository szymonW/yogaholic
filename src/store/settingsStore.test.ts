import { useSettingsStore } from './settingsStore';

beforeEach(() => {
  useSettingsStore.setState({ notificationsEnabled: true, instructorVoiceEnabled: true, prepCountdownSeconds: 3, language: 'pl' });
});

describe('useSettingsStore', () => {
  it('toggles notifications and instructor voice independently', () => {
    useSettingsStore.getState().toggleNotifications();
    expect(useSettingsStore.getState().notificationsEnabled).toBe(false);
    expect(useSettingsStore.getState().instructorVoiceEnabled).toBe(true);

    useSettingsStore.getState().toggleInstructorVoice();
    expect(useSettingsStore.getState().instructorVoiceEnabled).toBe(false);
  });

  it('sets the prep countdown', () => {
    useSettingsStore.getState().setPrepCountdown(5);
    expect(useSettingsStore.getState().prepCountdownSeconds).toBe(5);
  });

  it('sets the language', () => {
    useSettingsStore.getState().setLanguage('en');
    expect(useSettingsStore.getState().language).toBe('en');
  });
});
