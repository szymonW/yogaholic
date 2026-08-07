import Constants from 'expo-constants';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ScreenHeader } from '@/components';
import { useSettingsStore } from '@/store';
import { colors, radius, spacing } from '@/theme';
import { goBack } from '@/utils/navigation';

const PREP_PRESETS_SECONDS = [3, 5, 10];

interface SettingsRowProps {
  label: string;
  value: string;
  onPress?: () => void;
  isLast?: boolean;
}

function SettingsRow({ label, value, onPress, isLast }: SettingsRowProps) {
  const Wrapper = onPress ? Pressable : View;
  return (
    <Wrapper onPress={onPress} style={[styles.row, !isLast && styles.rowBorder]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </Wrapper>
  );
}

export default function SettingsScreen() {
  const { notificationsEnabled, instructorVoiceEnabled, prepCountdownSeconds, toggleNotifications, toggleInstructorVoice, setPrepCountdown } =
    useSettingsStore();

  const cyclePrepCountdown = () => {
    const currentIndex = PREP_PRESETS_SECONDS.indexOf(prepCountdownSeconds);
    const next = PREP_PRESETS_SECONDS[(currentIndex + 1) % PREP_PRESETS_SECONDS.length] ?? PREP_PRESETS_SECONDS[0];
    setPrepCountdown(next);
  };

  return (
    <View style={styles.root}>
      <ScreenHeader title="Ustawienia" onBack={goBack} />
      <View style={styles.content}>
        <View style={styles.card}>
          <SettingsRow label="Powiadomienia" value={notificationsEnabled ? 'Wł.' : 'Wył.'} onPress={toggleNotifications} />
          <SettingsRow label="Głos instruktora" value={instructorVoiceEnabled ? 'Wł.' : 'Wył.'} onPress={toggleInstructorVoice} />
          <SettingsRow label="Odliczanie przygotowania" value={`${prepCountdownSeconds} s`} onPress={cyclePrepCountdown} isLast />
        </View>

        <View style={styles.card}>
          <SettingsRow label="O aplikacji" value={Constants.expoConfig?.version ?? '1.0'} isLast />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
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
