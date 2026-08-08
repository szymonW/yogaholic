import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, ConfirmDialog, ScreenHeader, SequenceCard } from '@/components';
import { selectSequencesForCategory, useHistoryStore, useSequencesStore } from '@/store';
import { colors, spacing } from '@/theme';
import type { SequenceCategory } from '@/types';
import { formatRelativeDays, getLastPracticedDate } from '@/utils/history';
import { goBack } from '@/utils/navigation';
import { totalDuration } from '@/utils/time';

const CATEGORY_LABELS: Record<SequenceCategory, string> = {
  recent: 'Ostatnio ćwiczone',
  // Curated app content (BASE_SEQUENCES tagged "saved"), not a user bookmark list — there is
  // no save/bookmark action anywhere in the UI, so "Zapisane" would promise a feature that
  // doesn't exist.
  saved: 'Polecane sekwencje',
  sample: 'Przykładowe sekwencje',
  custom: 'Własne sekwencje',
};

export default function ListScreen() {
  const { category } = useLocalSearchParams<{ category: SequenceCategory }>();
  const label = CATEGORY_LABELS[category] ?? category;
  const isCustom = category === 'custom';
  const isRecent = category === 'recent';

  const customSequences = useSequencesStore((state) => state.customSequences);
  const recentIds = useSequencesStore((state) => state.recentIds);
  const removeCustomSequence = useSequencesStore((state) => state.removeCustomSequence);
  const historyEntries = useHistoryStore((state) => state.entries);
  const [pendingDelete, setPendingDelete] = useState<{ id: string; title: string } | null>(null);

  const sequences = selectSequencesForCategory(category, { customSequences, recentIds });
  const customIds = new Set(customSequences.map((sequence) => sequence.id));
  const today = new Date();

  return (
    <View style={styles.root}>
      <ScreenHeader title={label} onBack={goBack} />
      <ScrollView contentContainerStyle={styles.content}>
        {isCustom ? (
          <>
            <Button title="+ Nowa sekwencja" variant="secondary" style={styles.dashed} onPress={() => router.push('/create')} />
            <Button
              title="+ Nowe ćwiczenie"
              variant="secondary"
              style={styles.dashed}
              onPress={() => router.push('/create-exercise')}
            />
          </>
        ) : null}

        {sequences.length === 0 ? <Text style={styles.empty}>Brak sekwencji w tej kategorii.</Text> : null}

        {sequences.map((sequence) => {
          const lastPracticed = isRecent ? getLastPracticedDate(historyEntries, sequence.id) : undefined;
          const editable = customIds.has(sequence.id);
          return (
            <SequenceCard
              key={sequence.id}
              title={sequence.title}
              subtitle={`${sequence.exercises.length} pozycji • ${totalDuration(sequence.exercises)} łącznie`}
              lastLabel={lastPracticed ? formatRelativeDays(lastPracticed, today) : undefined}
              onStart={() => router.push(`/run/${sequence.id}`)}
              onOpenDetail={() => router.push(editable ? `/create?id=${sequence.id}` : `/detail/${sequence.id}`)}
              isEditable={editable}
              onDelete={isCustom ? () => setPendingDelete({ id: sequence.id, title: sequence.title }) : undefined}
            />
          );
        })}
      </ScrollView>

      <ConfirmDialog
        visible={pendingDelete !== null}
        title="Usunąć sekwencję?"
        message={pendingDelete ? `Sekwencja „${pendingDelete.title}” zostanie trwale usunięta. Tej operacji nie można cofnąć.` : undefined}
        confirmLabel="Usuń"
        onConfirm={() => {
          if (pendingDelete) removeCustomSequence(pendingDelete.id);
          setPendingDelete(null);
        }}
        onCancel={() => setPendingDelete(null)}
      />
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
  dashed: {
    borderStyle: 'dashed',
    borderColor: colors.accentDashed,
  },
  empty: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xxl,
  },
});
