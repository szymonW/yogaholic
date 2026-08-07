import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ProgressBar, ScreenHeader } from '@/components';
import { useGoalsStore, useHistoryStore } from '@/store';
import { colors, radius, spacing } from '@/theme';
import { computeStreak, summarizeWeek } from '@/utils/history';
import { goBack } from '@/utils/navigation';

export default function GoalsScreen() {
  const { goalSessions, goalMinutes, incGoalSessions, decGoalSessions, incGoalMinutes, decGoalMinutes } = useGoalsStore();
  const entries = useHistoryStore((state) => state.entries);

  const today = new Date();
  const { sessions: sessionsDone, minutes: minutesDone } = summarizeWeek(entries, today);
  const streak = computeStreak(entries, today);

  return (
    <View style={styles.root}>
      <ScreenHeader title="Cele" onBack={goBack} />
      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardLabel}>Sesje w tygodniu</Text>
            <Text style={styles.cardValue}>
              {sessionsDone} / {goalSessions}
            </Text>
          </View>
          <ProgressBar progress={sessionsDone / goalSessions} />
          <View style={styles.stepper}>
            <Pressable onPress={decGoalSessions} style={styles.stepButton}>
              <Text style={styles.stepLabel}>−</Text>
            </Pressable>
            <Text style={styles.stepGoal}>cel: {goalSessions}</Text>
            <Pressable onPress={incGoalSessions} style={styles.stepButton}>
              <Text style={styles.stepLabel}>+</Text>
            </Pressable>
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
