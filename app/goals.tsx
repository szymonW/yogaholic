import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ProgressBar, ScreenBackground, ScreenHeader } from '@/components';
import { useGoalsStore, useHistoryStore } from '@/store';
import { colors, radius, spacing } from '@/theme';
import { computeStreak, summarizeWeek } from '@/utils/history';
import { goBack } from '@/utils/navigation';

const DAY_LABELS = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'];

export default function GoalsScreen() {
  const { goalHistory, goalMinutes, incSessionDay, decSessionDay, incGoalMinutes, decGoalMinutes } = useGoalsStore();
  const entries = useHistoryStore((state) => state.entries);
  // The screen only ever edits the current (latest) snapshot — a change never rewrites the past.
  const sessionsPerDay = goalHistory[goalHistory.length - 1].sessionsPerDay;

  const today = new Date();
  const { minutes: minutesDone } = summarizeWeek(entries, today);
  const streak = computeStreak(entries, today);
  const goalSessionsTotal = sessionsPerDay.reduce((sum, count) => sum + count, 0);

  return (
    <ScreenBackground style={styles.root}>
      <ScreenHeader title="Cele" onBack={goBack} />
      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardLabel}>Sesje w dniu</Text>
            <Text style={styles.cardValue}>{goalSessionsTotal} / tyg.</Text>
          </View>
          <View style={styles.dayGrid}>
            <View style={styles.dayRow}>
              {DAY_LABELS.map((label) => (
                <Text key={label} style={styles.dayLabel}>
                  {label}
                </Text>
              ))}
            </View>
            <View style={styles.dayRow}>
              {sessionsPerDay.map((_, day) => (
                <Pressable key={day} onPress={() => incSessionDay(day)} style={styles.dayStepButton}>
                  <Text style={styles.stepLabel}>+</Text>
                </Pressable>
              ))}
            </View>
            <View style={styles.dayRow}>
              {sessionsPerDay.map((count, day) => (
                <Text key={day} style={styles.dayValue}>
                  {count}
                </Text>
              ))}
            </View>
            <View style={styles.dayRow}>
              {sessionsPerDay.map((_, day) => (
                <Pressable key={day} onPress={() => decSessionDay(day)} style={styles.dayStepButton}>
                  <Text style={styles.stepLabel}>−</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardLabel}>Minuty w tygodniu</Text>
            <Text style={styles.cardValue}>
              {minutesDone} / {goalMinutes}
            </Text>
          </View>
          <ProgressBar progress={minutesDone / goalMinutes} />
          <View style={styles.stepper}>
            <Pressable onPress={decGoalMinutes} style={styles.stepButton}>
              <Text style={styles.stepLabel}>−</Text>
            </Pressable>
            <Text style={styles.stepGoal}>cel: {goalMinutes}</Text>
            <Pressable onPress={incGoalMinutes} style={styles.stepButton}>
              <Text style={styles.stepLabel}>+</Text>
            </Pressable>
          </View>
        </View>

        <View style={[styles.card, styles.streakCard]}>
          <Text style={styles.cardLabel}>Aktualna seria</Text>
          <Text style={styles.streakValue}>{streak} dni</Text>
        </View>
      </View>
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
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg + 2,
    gap: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  cardValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent,
  },
  dayGrid: {
    gap: spacing.sm,
  },
  dayRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  dayLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  dayStepButton: {
    flex: 1,
    aspectRatio: 1.4,
    borderRadius: radius.sm,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayValue: {
    flex: 1,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: colors.accent,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing.md,
    marginTop: spacing.xxs,
  },
  stepButton: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepLabel: {
    fontSize: 18,
    color: colors.textPrimary,
  },
  stepGoal: {
    fontSize: 15,
    color: colors.textSecondary,
    minWidth: 60,
    textAlign: 'center',
  },
  streakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  streakValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.accent,
  },
});
