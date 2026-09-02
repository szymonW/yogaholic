import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Button, ScreenBackground } from '@/components';
import { CheckIcon } from '@/components/icons';
import { useTranslation } from '@/i18n';
import { useRunStore } from '@/store/runStore';
import { useSequencesStore } from '@/store/sequencesStore';
import { useSettingsStore } from '@/store/settingsStore';
import { colors, spacing, typography } from '@/theme';
import { goBack } from '@/utils/navigation';
import { totalDuration } from '@/utils/time';

export default function CompleteScreen() {
  const t = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const sequence = useSequencesStore((state) => state.getById(id));
  const pushRecent = useSequencesStore((state) => state.pushRecent);
  const prepSeconds = useSettingsStore((state) => state.prepCountdownSeconds);

  if (!sequence) {
    return (
      <ScreenBackground style={styles.root}>
        <Text style={typography.body}>{t.complete.notFound}</Text>
      </ScreenBackground>
    );
  }

  const handleRestart = () => {
    useRunStore.getState().start(sequence, prepSeconds);
    pushRecent(sequence.id);
    router.replace(`/run/${sequence.id}`);
  };

  const handleBackToList = () => {
    useRunStore.getState().reset();
    goBack();
  };

  return (
    <ScreenBackground style={styles.root}>
      <View style={styles.badge}>
        <CheckIcon />
      </View>
      <Text style={styles.title}>{t.complete.title}</Text>
      <Text style={styles.subtitle}>{t.complete.subtitle(t.sequences[sequence.id] ?? sequence.title)}</Text>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{sequence.exercises.length}</Text>
          <Text style={styles.statLabel}>{t.complete.positions}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{totalDuration(sequence.exercises)}</Text>
          <Text style={styles.statLabel}>{t.complete.time}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Button title={t.complete.repeat} size="lg" onPress={handleRestart} />
        <Button title={t.complete.backToList} variant="secondary" size="lg" onPress={handleBackToList} />
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg + 2,
    paddingHorizontal: 30,
    paddingVertical: spacing.xxxl,
  },
  badge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  stats: {
    flexDirection: 'row',
    gap: spacing.xxl,
    marginTop: spacing.xxs,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 2,
  },
  actions: {
    gap: spacing.sm + 2,
    width: '100%',
    marginTop: spacing.md,
  },
});
