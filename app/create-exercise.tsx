import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Image, ImageSourcePropType, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button, ScreenBackground, ScreenHeader, StepButton } from '@/components';
import { useExercisePoolStore } from '@/store';
import { colors, radius, spacing } from '@/theme';
import { goBack } from '@/utils/navigation';
import { formatDuration } from '@/utils/time';

const DURATION_MIN = 5;
const DURATION_STEP = 5;
const DURATION_DEFAULT = 30;
// Image picker area reduced by 30% vs. the original 3:2 box, keeping width fixed.
const IMAGE_ASPECT_RATIO = 3 / 2 / 0.7;

export default function CreateExerciseModal() {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState(DURATION_DEFAULT);
  const [imageUri, setImageUri] = useState<ImageSourcePropType | undefined>();
  const customExercises = useExercisePoolStore((state) => state.customExercises);
  const addExercise = useExercisePoolStore((state) => state.addExercise);
  const updateExerciseDuration = useExercisePoolStore((state) => state.updateExerciseDuration);
  const removeExercise = useExercisePoolStore((state) => state.removeExercise);

  const canSave = name.trim().length > 0;

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7 });
    if (!result.canceled && result.assets[0]) setImageUri({ uri: result.assets[0].uri });
  };

  const handleSave = () => {
    if (!canSave) return;
    addExercise({ name: name.trim(), duration, imageUri });
    setName('');
    setDuration(DURATION_DEFAULT);
    setImageUri(undefined);
  };

  const changeExerciseDuration = (index: number, delta: number) =>
    updateExerciseDuration(index, Math.max(DURATION_MIN, customExercises[index].duration + delta));

  return (
    <ScreenBackground style={styles.root}>
      <ScreenHeader title="Nowe ćwiczenie" size="h2" onBack={goBack} />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.field}>
          <Text style={styles.label}>Obrazek (opcjonalnie)</Text>
          <Pressable onPress={pickImage} style={styles.imageBox}>
            {imageUri ? (
              <Image source={imageUri} style={styles.imagePreview} resizeMode="cover" />
            ) : (
              <Text style={styles.imagePlaceholder}>Kliknij aby dodać obrazek</Text>
            )}
          </Pressable>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Nazwa ćwiczenia</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="np. Asana"
            placeholderTextColor={colors.textTertiary}
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Czas</Text>
          <View style={styles.durationRow}>
            <StepButton label="−" onStep={() => setDuration((d) => Math.max(DURATION_MIN, d - DURATION_STEP))} />
            <Text style={styles.durationValue}>{formatDuration(duration)}</Text>
            <StepButton label="+" onStep={() => setDuration((d) => d + DURATION_STEP)} />
          </View>
        </View>

        <View style={styles.actions}>
          <Button title="Anuluj" variant="secondary" size="sm" style={[styles.flex1, styles.cancelButton]} onPress={goBack} />
          <Button title="Zapisz" size="sm" style={styles.flex1} disabled={!canSave} onPress={handleSave} />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Twoje ćwiczenia ({customExercises.length})</Text>

          {customExercises.length === 0 ? (
            <Text style={styles.emptyText}>Nie dodałeś jeszcze żadnego ćwiczenia.</Text>
          ) : (
            customExercises.map((exercise, index) => (
              <View key={`${exercise.name}-${index}`} style={styles.itemRow}>
                <Text style={styles.itemName}>{exercise.name}</Text>
                <StepButton label="−" onStep={() => changeExerciseDuration(index, -DURATION_STEP)} />
                <Text style={styles.itemTime}>{formatDuration(exercise.duration)}</Text>
                <StepButton label="+" onStep={() => changeExerciseDuration(index, DURATION_STEP)} />
                <Pressable onPress={() => removeExercise(index)} accessibilityLabel={`Usuń ${exercise.name}`} style={styles.removeButton}>
                  <Text style={styles.removeLabel}>×</Text>
                </Pressable>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    gap: spacing.lg,
  },
  field: {
    gap: spacing.xs,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  imageBox: {
    aspectRatio: IMAGE_ASPECT_RATIO,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.accentDashed,
    borderRadius: 10,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  imagePlaceholder: {
    fontSize: 13,
    color: colors.textTertiary,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm + 2,
    paddingVertical: 12,
    paddingHorizontal: spacing.md + 2,
    color: colors.textPrimary,
    fontSize: 15,
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm + 2,
    paddingVertical: 10,
  },
  durationValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    minWidth: 56,
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xxs,
  },
  flex1: {
    flex: 1,
  },
  cancelButton: {
    backgroundColor: colors.surface,
  },
  emptyText: {
    fontSize: 13,
    color: colors.textTertiary,
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
});
