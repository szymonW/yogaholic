import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, IconButton } from '@/components';
import { ChevronLeftIcon } from '@/components/icons';
import { useSequencesStore } from '@/store';
import { colors, spacing, typography } from '@/theme';
import { formatDuration, totalDuration } from '@/utils/time';

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const sequence = useSequencesStore((state) => state.getById(id));

  if (!sequence) {
    return (
      <View style={styles.root}>
        <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
          <IconButton onPress={() => router.back()} accessibilityLabel="Wstecz">
            <ChevronLeftIcon />
          </IconButton>
        </View>
        <View style={styles.content}>
          <Text style={typography.body}>Nie znaleziono sekwencji.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <IconButton onPress={() => router.back()} accessibilityLabel="Wstecz">
          <ChevronLeftIcon />
        </IconButton>
        <Text style={[typography.h2, styles.title]}>{sequence.title}</Text>
        <Text style={styles.subtitle}>
          {sequence.exercises.length} pozycji • {totalDuration(sequence.exercises)} łącznie
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {sequence.exercises.map((exercise, index) => (
          <View key={`${exercise.name}-${index}`} style={styles.row}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <Text style={styles.exerciseTime}>{formatDuration(exercise.duration)}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Rozpocznij sekwencję" size="lg" onPress={() => router.push(`/run/${sequence.id}`)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    gap: spacing.md - 2,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxs,
  },
  title: {
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
    backgroundColor: colors.background,
  },
});
