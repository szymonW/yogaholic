import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { Button, ConfirmDialog, ScreenBackground, ScreenHeader, SequenceCard } from '@/components';
import { useTranslation } from '@/i18n';
import { selectSequencesForCategory, useHistoryStore, useSequencesStore } from '@/store';
import { colors, spacing } from '@/theme';
import type { SequenceCategory } from '@/types';
import { formatRelativeDays, getLastPracticedDate } from '@/utils/history';
import { goBack } from '@/utils/navigation';
import { totalDuration } from '@/utils/time';

export default function ListScreen() {
  const t = useTranslation();
  const { category } = useLocalSearchParams<{ category: SequenceCategory }>();
  const label = t.categories[category] ?? category;
  const isCustom = category === 'custom';
  const isRecent = category === 'recent';

  const customSequences = useSequencesStore((state) => state.customSequences);
  const recentIds = useSequencesStore((state) => state.recentIds);
  const favoriteIds = useSequencesStore((state) => state.favoriteIds);
  const removeCustomSequence = useSequencesStore((state) => state.removeCustomSequence);
  const toggleFavorite = useSequencesStore((state) => state.toggleFavorite);
  const historyEntries = useHistoryStore((state) => state.entries);
  const [pendingDelete, setPendingDelete] = useState<{ id: string; title: string } | null>(null);

  const sequences = selectSequencesForCategory(category, { customSequences, recentIds, favoriteIds });
  const customIds = new Set(customSequences.map((sequence) => sequence.id));
  const favoriteIdSet = new Set(favoriteIds);
  const today = new Date();

  return (
    <ScreenBackground style={styles.root}>
      <ScreenHeader title={label} onBack={goBack} />
      <ScrollView contentContainerStyle={styles.content}>
        {isCustom ? (
          <>
            <Button title={t.list.newSequence} variant="secondary" style={styles.dashed} onPress={() => router.push('/create')} />
            <Button title={t.list.newExercise} variant="secondary" style={styles.dashed} onPress={() => router.push('/create-exercise')} />
          </>
        ) : null}

        {sequences.length === 0 ? <Text style={styles.empty}>{t.list.empty}</Text> : null}

        {sequences.map((sequence) => {
          const lastPracticed = isRecent ? getLastPracticedDate(historyEntries, sequence.id) : undefined;
          const editable = customIds.has(sequence.id);
          const title = t.sequences[sequence.id] ?? sequence.title;
          return (
            <SequenceCard
              key={sequence.id}
              title={title}
              subtitle={t.list.subtitleDetail(sequence.exercises.length, totalDuration(sequence.exercises))}
              lastLabel={lastPracticed ? formatRelativeDays(lastPracticed, today, t.history) : undefined}
              onStart={() => router.push(`/run/${sequence.id}`)}
              onOpenDetail={() => router.push(editable ? `/create?id=${sequence.id}` : `/detail/${sequence.id}`)}
              isEditable={editable}
              onDelete={isCustom ? () => setPendingDelete({ id: sequence.id, title }) : undefined}
              isFavorite={favoriteIdSet.has(sequence.id)}
              onToggleFavorite={() => toggleFavorite(sequence.id)}
            />
          );
        })}
      </ScrollView>

      <ConfirmDialog
        visible={pendingDelete !== null}
        title={t.list.deleteTitle}
        message={pendingDelete ? t.list.deleteMessage(pendingDelete.title) : undefined}
        onConfirm={() => {
          if (pendingDelete) removeCustomSequence(pendingDelete.id);
          setPendingDelete(null);
        }}
        onCancel={() => setPendingDelete(null)}
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
