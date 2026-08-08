import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button, ScreenHeader } from '@/components';
import { selectAllExercises, useExercisePoolStore, useSequencesStore } from '@/store';
import { colors, radius, spacing, typography } from '@/theme';
import type { Exercise } from '@/types';
import { goBack } from '@/utils/navigation';
import { formatDuration } from '@/utils/time';

const DURATION_STEP = 5;
const DURATION_MIN = 10;

export default function CreateSequenceScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditing = Boolean(id);

  const customExercises = useExercisePoolStore((state) => state.customExercises);
  const addCustomSequence = useSequencesStore((state) => state.addCustomSequence);
  const updateCustomSequence = useSequencesStore((state) => state.updateCustomSequence);
  const existingSequence = useSequencesStore((state) => (id ? state.getById(id) : undefined));
  const pool = selectAllExercises({ customExercises });

  const [name, setName] = useState(existingSequence?.title ?? '');
  const [items, setItems] = useState<Exercise[]>(existingSequence?.exercises ?? []);
  const [pickerOpen, setPickerOpen] = useState(false);

  const canSave = name.trim().length > 0 && items.length > 0;
  const addedCounts = items.reduce<Record<string, number>>((counts, item) => {
    counts[item.name] = (counts[item.name] ?? 0) + 1;
    return counts;
  }, {});

  const addFromPool = (exercise: Exercise) =>
    setItems((prev) => [...prev, { name: exercise.name, duration: exercise.duration, imageUri: exercise.imageUri }]);
  const changeDuration = (index: number, delta: number) =>
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, duration: Math.max(DURATION_MIN, item.duration + delta) } : item)));
  const removeItem = (index: number) => setItems((prev) => prev.filter((_, i) => i !== index));

  const handleSave = () => {
    if (!canSave) return;
    if (isEditing && id) {
      updateCustomSequence(id, { title: name.trim(), exercises: items });
    } else {
      addCustomSequence({ title: name.trim(), exercises: items });
    }
    goBack();
  };

  if (isEditing && !existingSequence) {
    return (
      <View style={styles.root}>
        <ScreenHeader title="Edytuj sekwencję" size="h2" onBack={goBack} />
        <View style={styles.notFound}>
          <Text style={typography.body}>Nie znaleziono sekwencji.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <ScreenHeader title={isEditing ? 'Edytuj sekwencję' : 'Nowa sekwencja'} size="h2" onBack={goBack} />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.field}>
          <Text style={styles.label}>Nazwa sekwencji</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="np. Poranna energia"
            placeholderTextColor={colors.textTertiary}
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Pozycje ({items.length})</Text>

          {items.map((item, index) => (
            <View key={`${item.name}-${index}`} style={styles.itemRow}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Pressable onPress={() => changeDuration(index, -DURATION_STEP)} style={styles.stepButton}>
                <Text style={styles.stepLabel}>−</Text>
              </Pressable>
              <Text style={styles.itemTime}>{formatDuration(item.duration)}</Text>
              <Pressable onPress={() => changeDuration(index, DURATION_STEP)} style={styles.stepButton}>
                <Text style={styles.stepLabel}>+</Text>
              </Pressable>
              <Pressable onPress={() => removeItem(index)} accessibilityLabel={`Usuń ${item.name}`} style={styles.removeButton}>
                <Text style={styles.removeLabel}>×</Text>
              </Pressable>
            </View>
          ))}

          <Button title="+ Dodaj pozycję" variant="secondary" style={styles.dashed} onPress={() => setPickerOpen((v) => !v)} />

          {pickerOpen ? (
            <ScrollView style={styles.picker} nestedScrollEnabled>
              {pool.map((exercise, index) => {
                const addedCount = addedCounts[exercise.name] ?? 0;
                return (
                  <Pressable
                    key={`${exercise.name}-${index}`}
                    onPress={() => addFromPool(exercise)}
                    style={[styles.pickerRow, addedCount > 0 && styles.pickerRowAdded]}
                  >
                    <Text style={styles.pickerName}>{exercise.name}</Text>
                    <View style={styles.pickerRight}>
                      {addedCount > 0 ? (
                        <Text style={styles.pickerAdded}>✓ dodano{addedCount > 1 ? ` ×${addedCount}` : ''}</Text>
                      ) : null}
                      <Text style={styles.pickerTime}>{formatDuration(exercise.duration)}</Text>
                    </View>
                  </Pressable>
                );
              })}
            </ScrollView>
          ) : null}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button title={isEditing ? 'Zapisz zmiany' : 'Zapisz sekwencję'} size="lg" disabled={!canSave} onPress={handleSave} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: {
    padding: spacing.xl,
    paddingTop: spacing.xxs,
    gap: spacing.xl,
  },
  field: {
    gap: spacing.sm,
  },
  label: {
    fontSize: 13,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    color: colors.textPrimary,
    fontSize: 16,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
  },
  itemName: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
  },
  stepButton: {
    width: 28,
    height: 28,
    borderRadius: radius.xs,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepLabel: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  itemTime: {
    fontSize: 14,
    color: colors.accent,
    minWidth: 40,
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
  },
  removeButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeLabel: {
    fontSize: 18,
    color: colors.textTertiary,
  },
  dashed: {
    borderStyle: 'dashed',
    borderColor: colors.accentDashed,
    marginTop: spacing.xs,
  },
  picker: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    padding: spacing.sm,
    maxHeight: 220,
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: radius.sm,
    paddingVertical: 10,
    paddingHorizontal: spacing.sm,
  },
  pickerRowAdded: {
    backgroundColor: colors.surface,
  },
  pickerName: {
    fontSize: 14,
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.sm,
  },
  pickerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  pickerAdded: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.accent,
  },
  pickerTime: {
    fontSize: 14,
    color: colors.textTertiary,
  },
  footer: {
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
    backgroundColor: colors.background,
  },
});
