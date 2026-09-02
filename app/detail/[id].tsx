import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, IconButton, ScreenBackground } from '@/components';
import { ChevronLeftIcon } from '@/components/icons';
import { useTranslation } from '@/i18n';
import { useSequencesStore } from '@/store';
import { colors, spacing, typography } from '@/theme';
import { goBack } from '@/utils/navigation';
import { formatDuration, totalDuration } from '@/utils/time';

export default function DetailScreen() {
  const t = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const sequence = useSequencesStore((state) => state.getById(id));

  if (!sequence) {
    return (
      <ScreenBackground style={styles.root}>
        <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
          <IconButton onPress={goBack} accessibilityLabel={t.common.back}>
            <ChevronLeftIcon />
          </IconButton>
        </View>
        <View style={styles.content}>
          <Text style={typography.body}>{t.detail.notFound}</Text>
        </View>
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <View style={styles.headerRow}>
          <IconButton onPress={goBack} accessibilityLabel={t.common.back}>
            <ChevronLeftIcon />
          </IconButton>
          <Text style={[typography.h2, styles.title]}>{t.sequences[sequence.id] ?? sequence.title}</Text>
        </View>
        <Text style={styles.subtitle}>{t.detail.subtitle(sequence.exercises.length, totalDuration(sequence.exercises))}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {sequence.exercises.map((exercise, index) => (
          <View key={`${exercise.name}-${index}`} style={styles.row}>
            <Text style={styles.exerciseName}>{t.exercises[exercise.name] ?? exercise.name}</Text>
            <Text style={styles.exerciseTime}>{formatDuration(exercise.duration)}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Button title={t.detail.start} size="lg" onPress={() => router.push(`/run/${sequence.id}`)} />
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    gap: spacing.md - 2,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxs,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  title: {
    flex: 1,
    minWidth: 0,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: -spacing.sm,
  },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: {
    padding: spacing.xl,
    paddingTop: spacing.md - 2,
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
  },
  exerciseName: {
    fontSize: 15,
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.md,
  },
  exerciseTime: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.accent,
  },
  footer: {
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
  },
});
