import { router } from 'expo-router';
import { type ReactElement, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconButton, ScreenBackground } from '@/components';
import {
  BookmarkIcon,
  CalendarIcon,
  CirclePlusIcon,
  ClockIcon,
  SettingsIcon,
  SparkleIcon,
  TargetIcon,
} from '@/components/icons';
import type { IconProps } from '@/components/icons';
import { BASE_SEQUENCES } from '@/data/sampleSequences';
import { useTranslation } from '@/i18n';
import { useGoalsStore, useHistoryStore, useSequencesStore, useSettingsStore } from '@/store';
import { colors, radius, spacing, typography } from '@/theme';
import type { SequenceCategory } from '@/types';
import { computeStreak, summarizeWeek, toISODate } from '@/utils/history';

// Reminder banner re-evaluates on a timer (rather than only at mount) so it appears the moment
// the set hour ticks over without requiring the user to leave and reopen the screen.
const REMINDER_CHECK_INTERVAL_MS = 60_000;

const SAMPLE_COUNT = BASE_SEQUENCES.filter((sequence) => sequence.tags?.includes('sample')).length;

interface TileConfig {
  key: string;
  title: string;
  subtitle: string;
  Icon: (props: IconProps) => ReactElement;
  onPress: () => void;
}

export default function Home() {
  const t = useTranslation();
  const insets = useSafeAreaInsets();

  const recentCount = useSequencesStore((state) => state.recentIds.length);
  const customCount = useSequencesStore((state) => state.customSequences.length);
  const savedCount = useSequencesStore((state) => state.favoriteIds.length);
  const goalHistory = useGoalsStore((state) => state.goalHistory);
  const goalSessions = goalHistory[goalHistory.length - 1].sessionsPerDay.reduce((sum, count) => sum + count, 0);
  const entries = useHistoryStore((state) => state.entries);
  const { notificationsEnabled, reminderHour, reminderMinute } = useSettingsStore();

  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), REMINDER_CHECK_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  const { sessions: sessionsDone } = summarizeWeek(entries, now);
  const streak = computeStreak(entries, now);
  const exercisedToday = entries.some((entry) => entry.dateISO === toISODate(now));
  const reminderTimeReached =
    now.getHours() > reminderHour || (now.getHours() === reminderHour && now.getMinutes() >= reminderMinute);
  const showReminderBanner = notificationsEnabled && reminderTimeReached && !exercisedToday;

  const openCategory = (category: SequenceCategory) => router.push(`/list/${category}`);

  const tiles: TileConfig[] = [
    {
      key: 'recent',
      title: t.categories.recent,
      subtitle: t.home.sequencesCount(recentCount),
      Icon: ClockIcon,
      onPress: () => openCategory('recent'),
    },
    {
      key: 'saved',
      title: t.categories.saved,
      subtitle: t.home.sequencesCount(savedCount),
      Icon: BookmarkIcon,
      onPress: () => openCategory('saved'),
    },
    {
      key: 'sample',
      title: t.categories.sample,
      subtitle: t.home.sequencesCount(SAMPLE_COUNT),
      Icon: SparkleIcon,
      onPress: () => openCategory('sample'),
    },
    {
      key: 'custom',
      title: t.categories.custom,
      subtitle: t.home.sequencesCount(customCount),
      Icon: CirclePlusIcon,
      onPress: () => openCategory('custom'),
    },
    {
      key: 'calendar',
      title: t.home.calendarTitle,
      subtitle: t.home.streakDays(streak),
      Icon: CalendarIcon,
      onPress: () => router.push('/calendar'),
    },
    {
      key: 'goals',
      title: t.home.goalsTitle,
      subtitle: t.home.weekProgress(sessionsDone, goalSessions),
      Icon: TargetIcon,
      onPress: () => router.push('/goals'),
    },
  ];

  return (
    <ScreenBackground style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <Text style={[typography.display, styles.title]}>{t.home.brand}</Text>
        <IconButton onPress={() => router.push('/settings')} accessibilityLabel={t.home.settingsA11y} style={styles.settingsButton}>
          <SettingsIcon />
        </IconButton>
      </View>

      {showReminderBanner ? (
        <View style={styles.reminderBanner}>
          <ClockIcon size={18} color={colors.accentOn} />
          <Text style={styles.reminderBannerText}>{t.home.reminderBanner}</Text>
        </View>
      ) : null}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.grid}>
          {tiles.map(({ key, title, subtitle, Icon, onPress }) => (
            <Pressable key={key} onPress={onPress} style={({ pressed }) => [styles.tile, pressed && styles.tilePressed]}>
              <View style={styles.tileIconWrap}>
                <Icon />
              </View>
              <View style={styles.tileTextWrap}>
                <Text style={styles.tileTitle} numberOfLines={2}>
                  {title}
                </Text>
                <Text style={styles.tileSubtitle} numberOfLines={1}>
                  {subtitle}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.sm,
  },
  reminderBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.accent,
  },
  reminderBannerText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.accentOn,
  },
  title: {
    color: colors.textPrimary,
  },
  settingsButton: {
    marginTop: spacing.xxs,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  tile: {
    width: '47%',
    minHeight: 87,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xxl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  tilePressed: {
    opacity: 0.8,
  },
  tileIconWrap: {
    width: 34,
    height: 34,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    opacity: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  tileTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  tileTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    lineHeight: 18,
  },
  tileSubtitle: {
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 2,
  },
});
