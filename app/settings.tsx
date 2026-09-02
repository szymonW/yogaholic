import Constants from 'expo-constants';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LanguagePickerModal, ScreenBackground, ScreenHeader, Toggle } from '@/components';
import { LANGUAGE_OPTIONS, useTranslation } from '@/i18n';
import { useSettingsStore } from '@/store';
import { colors, radius, spacing } from '@/theme';
import { goBack } from '@/utils/navigation';

const PREP_PRESETS_SECONDS = [3, 5, 10];

interface SettingsRowProps {
  label: string;
  /** Plain text value (e.g. a duration or version string). Ignored when `toggleValue` is set. */
  value?: string;
  /** When provided, renders a Toggle instead of the text value. */
  toggleValue?: boolean;
  onPress?: () => void;
  isLast?: boolean;
}

function SettingsRow({ label, value, toggleValue, onPress, isLast }: SettingsRowProps) {
  const Wrapper = onPress ? Pressable : View;
  const isToggle = toggleValue !== undefined;
  return (
    <Wrapper
      onPress={onPress}
      style={[styles.row, !isLast && styles.rowBorder]}
      accessibilityRole={isToggle ? 'switch' : onPress ? 'button' : undefined}
      accessibilityState={isToggle ? { checked: toggleValue } : undefined}
    >
      <Text style={styles.rowLabel}>{label}</Text>
      {isToggle ? <Toggle value={toggleValue} /> : <Text style={styles.rowValue}>{value}</Text>}
    </Wrapper>
  );
}

export default function SettingsScreen() {
  const t = useTranslation();
  const { notificationsEnabled, instructorVoiceEnabled, prepCountdownSeconds, language, toggleNotifications, toggleInstructorVoice, setPrepCountdown, setLanguage } =
    useSettingsStore();
  const [languagePickerVisible, setLanguagePickerVisible] = useState(false);

  const cyclePrepCountdown = () => {
    const currentIndex = PREP_PRESETS_SECONDS.indexOf(prepCountdownSeconds);
    const next = PREP_PRESETS_SECONDS[(currentIndex + 1) % PREP_PRESETS_SECONDS.length] ?? PREP_PRESETS_SECONDS[0];
    setPrepCountdown(next);
  };

  const currentLanguageLabel = LANGUAGE_OPTIONS.find((option) => option.code === language)?.label ?? language;

  return (
    <ScreenBackground style={styles.root}>
      <ScreenHeader title={t.settingsTitle} onBack={goBack} />
      <View style={styles.content}>
        <View style={styles.card}>
          <SettingsRow label={t.notifications} toggleValue={notificationsEnabled} onPress={toggleNotifications} />
          <SettingsRow label={t.instructorVoice} toggleValue={instructorVoiceEnabled} onPress={toggleInstructorVoice} />
          <SettingsRow label={t.prepCountdown} value={t.prepCountdownValue(prepCountdownSeconds)} onPress={cyclePrepCountdown} />
          <SettingsRow label={t.language} value={currentLanguageLabel} onPress={() => setLanguagePickerVisible(true)} isLast />
        </View>

        <View style={styles.card}>
          <SettingsRow label={t.appVersion} value={Constants.expoConfig?.version ?? '1.0.0'} isLast />
        </View>
      </View>

      <LanguagePickerModal
        visible={languagePickerVisible}
        selectedCode={language}
        onSelect={(code) => {
          setLanguage(code);
          setLanguagePickerVisible(false);
        }}
        onClose={() => setLanguagePickerVisible(false)}
      />
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: {
    padding: spacing.xl,
    paddingTop: spacing.md,
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowLabel: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  rowValue: {
    fontSize: 15,
    color: colors.textSecondary,
  },
});
