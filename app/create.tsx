import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button, ScreenHeader } from '@/components';
import { selectAllExercises, useExercisePoolStore, useSequencesStore } from '@/store';
import { colors, radius, spacing } from '@/theme';
import type { Exercise } from '@/types';
import { formatDuration } from '@/utils/time';

const DURATION_STEP = 5;
const DURATION_MIN = 10;

export default function CreateSequenceScreen() {
  const [name, setName] = useState('');
  const [items, setItems] = useState<Exercise[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);

  const customExercises = useExercisePoolStore((state) => state.customExercises);
  const addCustomSequence = useSequencesStore((state) => state.addCustomSequence);
  const pool = selectAllExercises({ customExercises });

  const canSave = name.trim().length > 0 && items.length > 0;

  const addFromPool = (exercise: Exercise) => setItems((prev) => [...prev, { name: exercise.name, duration: exercise.duration }]);
  const changeDuration = (index: number, delta: number) =>
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, duration: Math.max(DURATION_MIN, item.duration + delta) } : item)));
  const removeItem = (index: number) => setItems((prev) => prev.filter((_, i) => i !== index));

  const handleSave = () => {
    if (!canSave) return;
    addCustomSequence({ title: name.trim(), exercises: items });
    router.back();
  };

  return (
    <View style={styles.root}>
      <ScreenHeader title="Nowa sekwencja" size="h2" onBack={() => router.back()} />

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
              {pool.map((exercise, index) => (
                <Pressable key={`${exercise.name}-${index}`} onPress={() => addFromPool(exercise)} style={styles.pickerRow}>
                  <Text style={styles.pickerName}>{exercise.name}</Text>
                  <Text style={styles.pickerTime}>{formatDuration(exercise.duration)}</Text>
                </Pressable>
              ))}
            </ScrollView>
          ) : null}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Zapisz sekwencję" size="lg" disabled={!canSave} onPress={handleSave} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
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
    paddingVertical: 10,
    paddingHorizontal: spacing.sm,
  },
  pickerName: {
    fontSize: 14,
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.sm,
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
