// TEMPORARY design-system preview — replaced by the real Home screen in Faza 3.
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Card, IconButton, ProgressBar, ScreenHeader } from '@/components';
import {
  BookmarkIcon,
  CalendarIcon,
  CheckIcon,
  CirclePlusIcon,
  ClockIcon,
  PauseIcon,
  PlayIcon,
  SettingsIcon,
  SkipIcon,
  SparkleIcon,
  TargetIcon,
  TrashIcon,
} from '@/components/icons';
import { colors, spacing, typography } from '@/theme';

export default function DesignSystemPreview() {
  return (
    <View style={styles.root}>
      <ScreenHeader title="Design system" subtitle="Podgląd Fazy 1" onBack={() => {}} size="h2" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={typography.label}>Ikony</Text>
        <View style={styles.iconRow}>
          <ClockIcon />
          <BookmarkIcon />
          <SparkleIcon />
          <CirclePlusIcon />
          <CalendarIcon />
          <TargetIcon />
          <TrashIcon />
          <CheckIcon size={26} />
          <IconButton accessibilityLabel="Ustawienia">
            <SettingsIcon />
          </IconButton>
          <View style={[styles.playCircle]}>
            <PlayIcon />
          </View>
          <View style={[styles.playCircle]}>
            <PauseIcon />
          </View>
          <View style={styles.skipCircle}>
            <SkipIcon />
          </View>
        </View>

        <Text style={typography.label}>Przyciski</Text>
        <View style={styles.buttonColumn}>
          <Button title="Rozpocznij sekwencję" variant="primary" size="lg" />
          <Button title="Wróć do listy" variant="secondary" size="lg" />
          <View style={styles.buttonRow}>
            <Button title="Start" variant="primary" style={styles.flex1} />
            <Button title="Edytuj" variant="secondary" style={styles.flex1} />
          </View>
          <Button title="Zapisz sekwencję (disabled)" variant="primary" size="lg" disabled />
        </View>

        <Text style={typography.label}>Karta</Text>
        <Card>
          <Text style={typography.bodyLg}>Poranne przebudzenie</Text>
          <Text style={{ color: colors.textSecondary, fontSize: 13, marginTop: 4 }}>5 pozycji • 3:35 łącznie</Text>
        </Card>

        <Text style={typography.label}>Progress bar (cele)</Text>
        <ProgressBar progress={0.5} />

        <Text style={typography.label}>Progress bar (trening)</Text>
        <ProgressBar progress={0.3} height={4} trackColor={colors.border} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
    gap: spacing.md,
  },
  iconRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.lg,
    marginBottom: spacing.lg,
  },
  playCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonColumn: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  flex1: {
    flex: 1,
  },
});
