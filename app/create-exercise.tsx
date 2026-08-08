import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Image, ImageSourcePropType, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components';
import { useExercisePoolStore } from '@/store';
import { colors, radius, spacing, typography } from '@/theme';
import { goBack } from '@/utils/navigation';

const DURATION_MIN = 5;

export default function CreateExerciseModal() {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [imageUri, setImageUri] = useState<ImageSourcePropType | undefined>();
  const addExercise = useExercisePoolStore((state) => state.addExercise);

  const durationNumber = parseInt(duration, 10);
  const canSave = name.trim().length > 0 && duration.length > 0 && !Number.isNaN(durationNumber) && durationNumber >= DURATION_MIN;

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7 });
    if (!result.canceled && result.assets[0]) setImageUri({ uri: result.assets[0].uri });
  };

  const handleSave = () => {
    if (!canSave) return;
    addExercise({ name: name.trim(), duration: durationNumber, imageUri });
    goBack();
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.xl }]}>
      <Text style={[typography.h2, styles.title]}>Nowe ćwiczenie</Text>

      <View style={styles.field}>
        <Text style={styles.label}>Obrazek</Text>
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
        <Text style={styles.label}>Czas (sekundy)</Text>
        <TextInput
          value={duration}
          onChangeText={setDuration}
          placeholder="np. 60"
          placeholderTextColor={colors.textTertiary}
          keyboardType="number-pad"
          style={[styles.input, styles.inputCentered]}
        />
      </View>

      <View style={styles.actions}>
        <Button title="Anuluj" variant="secondary" size="sm" style={styles.flex1} onPress={goBack} />
        <Button title="Zapisz" size="sm" style={styles.flex1} disabled={!canSave} onPress={handleSave} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xl,
    gap: spacing.lg,
  },
  title: {
    color: colors.textPrimary,
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
    aspectRatio: 3 / 2,
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
  inputCentered: {
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xxs,
  },
  flex1: {
    flex: 1,
  },
});
