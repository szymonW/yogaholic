import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components';
import { CheckIcon } from '@/components/icons';
import { useRunStore } from '@/store/runStore';
import { useSequencesStore } from '@/store/sequencesStore';
import { useSettingsStore } from '@/store/settingsStore';
import { colors, spacing, typography } from '@/theme';
import { goBack } from '@/utils/navigation';
import { totalDuration } from '@/utils/time';

export default function CompleteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const sequence = useSequencesStore((state) => state.getById(id));
  const pushRecent = useSequencesStore((state) => state.pushRecent);
  const prepSeconds = useSettingsStore((state) => state.prepCountdownSeconds);

  if (!sequence) {
    return (
      <View style={styles.root}>
        <Text style={typography.body}>Nie znaleziono sekwencji.</Text>
      </View>
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
    <View style={styles.root}>
      <View style={styles.badge}>
        <CheckIcon />
      </View>
      <Text style={styles.title}>Świetna robota!</Text>
      <Text style={styles.subtitle}>Zakończyłeś sekwencję {sequence.title}</Text>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{sequence.exercises.length}</Text>
          <Text style={styles.statLabel}>pozycji</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{totalDuration(sequence.exercises)}</Text>
          <Text style={styles.statLabel}>czasu</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Button title="Powtórz sekwencję" size="lg" onPress={handleRestart} />
        <Button title="Wróć do listy" variant="secondary" size="lg" onPress={handleBackToList} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
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
