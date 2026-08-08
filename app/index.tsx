import { router } from 'expo-router';
import type { ReactElement } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconButton } from '@/components';
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
import { useGoalsStore, useHistoryStore, useSequencesStore } from '@/store';
import { colors, radius, spacing, typography } from '@/theme';
import type { SequenceCategory } from '@/types';
import { computeStreak, summarizeWeek } from '@/utils/history';

const SAVED_COUNT = BASE_SEQUENCES.filter((sequence) => sequence.tags?.includes('saved')).length;
const SAMPLE_COUNT = BASE_SEQUENCES.filter((sequence) => sequence.tags?.includes('sample')).length;

interface TileConfig {
  key: string;
  title: string;
  subtitle: string;
  Icon: (props: IconProps) => ReactElement;
  onPress: () => void;
}

export default function Home() {
  const insets = useSafeAreaInsets();

  const recentCount = useSequencesStore((state) => state.recentIds.length);
  const customCount = useSequencesStore((state) => state.customSequences.length);
  const goalSessions = useGoalsStore((state) => state.goalSessions);
  const entries = useHistoryStore((state) => state.entries);

  const today = new Date();
  const { sessions: sessionsDone } = summarizeWeek(entries, today);
  const streak = computeStreak(entries, today);

  const openCategory = (category: SequenceCategory) => router.push(`/list/${category}`);

  const tiles: TileConfig[] = [
    {
      key: 'recent',
      title: 'Ostatnio ćwiczone',
      subtitle: `${recentCount} sekwencji`,
      Icon: ClockIcon,
      onPress: () => openCategory('recent'),
    },
    {
      key: 'saved',
      title: 'Polecane sekwencje',
      subtitle: `${SAVED_COUNT} sekwencji`,
      Icon: BookmarkIcon,
      onPress: () => openCategory('saved'),
    },
    {
      key: 'sample',
      title: 'Przykładowe sekwencje',
      subtitle: `${SAMPLE_COUNT} sekwencji`,
      Icon: SparkleIcon,
      onPress: () => openCategory('sample'),
    },
    {
      key: 'custom',
      title: 'Własne sekwencje',
      subtitle: `${customCount} sekwencji`,
      Icon: CirclePlusIcon,
      onPress: () => openCategory('custom'),
    },
    {
      key: 'calendar',
      title: 'Kalendarz',
      subtitle: `seria ${streak} dni`,
      Icon: CalendarIcon,
      onPress: () => router.push('/calendar'),
    },
    {
      key: 'goals',
      title: 'Cele',
      subtitle: `${sessionsDone}/${goalSessions} w tym tyg.`,
      Icon: TargetIcon,
      onPress: () => router.push('/goals'),
    },
  ];

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <View>
          <Text style={[typography.display, styles.title]}>Yogaholic</Text>
          <Text style={styles.subtitle}>Wybierz sekwencję do ćwiczenia</Text>
        </View>
        <IconButton onPress={() => router.push('/settings')} accessibilityLabel="Ustawienia" style={styles.settingsButton}>
          <SettingsIcon />
        </IconButton>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.grid}>
          {tiles.map(({ key, title, subtitle, Icon, onPress }) => (
            <Pressable key={key} onPress={onPress} style={({ pressed }) => [styles.tile, pressed && styles.tilePressed]}>
              <View style={styles.tileIconWrap}>
                <Icon />
              </View>
              <View>
                <Text style={styles.tileTitle}>{title}</Text>
                <Text style={styles.tileSubtitle}>{subtitle}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.sm,
  },
  title: {
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: spacing.xxs,
  },
  settingsButton: {
    marginTop: spacing.xxs,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  tile: {
    width: '47%',
    aspectRatio: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xxl,
    padding: spacing.xl,
    justifyContent: 'space-between',
  },
  tilePressed: {
    opacity: 0.8,
  },
  tileIconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  tileSubtitle: {
    fontSize: 13,
    color: colors.textTertiary,
    marginTop: 2,
  },
});
