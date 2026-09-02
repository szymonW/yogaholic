import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { IconButton, ScreenBackground, ScreenHeader } from '@/components';
import { ChevronLeftIcon } from '@/components/icons';
import { useTranslation } from '@/i18n';
import { getSessionGoalForDate, useGoalsStore, useHistoryStore } from '@/store';
import { colors, radius, spacing } from '@/theme';
import { addDays } from '@/utils/history';
import {
  formatShortDate,
  getDoneDaysInMonth,
  getEventBlockPosition,
  getHourLabels,
  getMonthCells,
  getMonthLabel,
  getWeekDays,
  historyToDayEvents,
  type MonthCellState,
} from '@/utils/calendar';
import { goBack } from '@/utils/navigation';

const ROW_HEIGHT = 11 * 0.8; // 20% shorter than the original 11px/hour
const GUTTER_WIDTH = 26;
const HOUR_RANGE = { start: 0, end: 24 };
// Fixed cell height for the month grid, decoupled from screen width. Rows are pinned to 6 —
// March 2026 (6 rows, the max a month ever needs) — so the section height never jumps as the
// user navigates between shorter and longer months.
const MONTH_CELL_HEIGHT = 34;
const MONTH_ROWS = 6;
// Fixed square badge for the day marker, so "done"/"today" fills render as a true circle
// regardless of the (non-square) cell's own width/height.
const MONTH_BADGE_SIZE = 26;
// No scheduling feature exists yet, so there is nothing real to mark as "planned" —
// left empty rather than inventing sessions the user never actually planned.
const PLANNED_DAYS = new Set<number>();

const MONTH_CELL_STYLES: Record<
  MonthCellState,
  { backgroundColor: string; borderColor?: string; borderStyle?: 'dashed' | 'solid'; textColor: string }
> = {
  empty: { backgroundColor: 'transparent', textColor: 'transparent' },
  today: { backgroundColor: colors.accent, textColor: colors.accentOn },
  // Same fill as "done" (so a completed day always reads as done, even today), plus an accent
  // ring so today stays visually distinguishable from any other done day in the month.
  todayDone: { backgroundColor: colors.calendarDoneBg + '48', borderColor: colors.accent, borderStyle: 'solid', textColor: colors.textPrimary },
  done: { backgroundColor: colors.calendarDoneBg + '48', textColor: colors.textPrimary },
  missed: { backgroundColor: 'transparent', textColor: colors.textFaint },
  missedGoal: { backgroundColor: colors.danger + '48', textColor: colors.textPrimary },
  planned: { backgroundColor: 'transparent', borderColor: colors.accentDashed, borderStyle: 'dashed', textColor: colors.textPrimary },
  rest: { backgroundColor: 'transparent', textColor: colors.textTertiary },
};

export default function CalendarScreen() {
  const t = useTranslation();
  const entries = useHistoryStore((state) => state.entries);
  const goalHistory = useGoalsStore((state) => state.goalHistory);
  const today = new Date();
  // A goal change only ever applies from today onward — never retroactively — so each date must
  // resolve against whatever goal snapshot was actually in effect on that date.
  const getSessionGoal = (date: Date) => getSessionGoalForDate(goalHistory, date);

  // Both <= 0: 0 is the current week/month, -1 the previous one, etc. — navigated independently.
  const [weekOffset, setWeekOffset] = useState(0);
  const [monthOffset, setMonthOffset] = useState(0);

  const weekAnchor = addDays(today, weekOffset * 7);
  const monthAnchor = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);

  const eventsByDate = historyToDayEvents(entries);
  const weekDays = getWeekDays(weekAnchor, eventsByDate, 3, today, getSessionGoal, t.calendar.weekdayLetters);
  const hourLabels = getHourLabels(HOUR_RANGE.start, HOUR_RANGE.end, ROW_HEIGHT);
  const gridHeight = (HOUR_RANGE.end - HOUR_RANGE.start) * ROW_HEIGHT;
  const weekLabel =
    weekOffset === 0
      ? t.calendar.thisWeek
      : `${formatShortDate(weekDays[0].date, t.calendar.monthNamesShort)} – ${formatShortDate(weekDays[6].date, t.calendar.monthNamesShort)}`;

  const doneDays = getDoneDaysInMonth(entries, monthAnchor);
  const monthCells = getMonthCells(monthAnchor, doneDays, PLANNED_DAYS, today, getSessionGoal);

  const goToToday = () => {
    setWeekOffset(0);
    setMonthOffset(0);
  };

  return (
    <ScreenBackground style={styles.root}>
      <ScreenHeader
        title={t.calendar.title}
        onBack={goBack}
        action={
          <Pressable
            onPress={goToToday}
            accessibilityRole="button"
            accessibilityLabel={t.calendar.todayA11y}
            style={({ pressed }) => [styles.todayButton, pressed && styles.todayButtonPressed]}
          >
            <Text style={styles.todayButtonLabel}>{t.calendar.today}</Text>
          </Pressable>
        }
      />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.section, styles.monthSection]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>{getMonthLabel(monthAnchor, t.calendar.monthNames)}</Text>
            <View style={styles.navButtons}>
              <IconButton accessibilityLabel={t.calendar.prevMonthA11y} size={28} onPress={() => setMonthOffset((v) => v - 1)}>
                <ChevronLeftIcon size={14} />
              </IconButton>
              <IconButton
                accessibilityLabel={t.calendar.nextMonthA11y}
                size={28}
                disabled={monthOffset === 0}
                onPress={() => setMonthOffset((v) => Math.min(0, v + 1))}
              >
                <View style={styles.chevronRight}>
                  <ChevronLeftIcon size={14} />
                </View>
              </IconButton>
            </View>
          </View>
          <View style={styles.monthHeaderRow}>
            {t.calendar.weekdayLetters.map((label) => (
              <Text key={label} style={styles.monthHeaderLabel}>
                {label}
              </Text>
            ))}
          </View>
          <View style={styles.monthGrid}>
            {monthCells.map((cell, index) => {
              const cellStyle = MONTH_CELL_STYLES[cell.state];
              // "Done"/"missed goal" fills are round badges; every other marker keeps the old full-cell rect.
              const isBadge = cell.state === 'done' || cell.state === 'todayDone' || cell.state === 'missedGoal';
              return (
                <View key={index} style={styles.monthCell}>
                  {cell.day !== null ? (
                    <View
                      style={[
                        isBadge ? styles.monthCellBadge : styles.monthCellFill,
                        {
                          backgroundColor: cellStyle.backgroundColor,
                          borderColor: cellStyle.borderColor,
                          borderStyle: cellStyle.borderStyle,
                          borderWidth: cellStyle.borderColor ? 1.5 : 0,
                        },
                      ]}
                    >
                      <Text style={[styles.monthCellText, { color: cellStyle.textColor }]}>{cell.day}</Text>
                    </View>
                  ) : null}
                </View>
              );
            })}
          </View>
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.calendarDoneBg + '48' }]} />
              <Text style={styles.legendLabel}>{t.calendar.done}</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.danger + '48' }]} />
              <Text style={styles.legendLabel}>{t.calendar.missedGoal}</Text>
            </View>
            {/* "Zaplanowane" is left out until a real scheduling feature exists — see PLANNED_DAYS above. */}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>{weekLabel}</Text>
            <View style={styles.navButtons}>
              <IconButton accessibilityLabel={t.calendar.prevWeekA11y} size={28} onPress={() => setWeekOffset((v) => v - 1)}>
                <ChevronLeftIcon size={14} />
              </IconButton>
              <IconButton
                accessibilityLabel={t.calendar.nextWeekA11y}
                size={28}
                disabled={weekOffset === 0}
                onPress={() => setWeekOffset((v) => Math.min(0, v + 1))}
              >
                <View style={styles.chevronRight}>
                  <ChevronLeftIcon size={14} />
                </View>
              </IconButton>
            </View>
          </View>

          <View style={styles.weekHeaderRow}>
            <View style={{ width: GUTTER_WIDTH }} />
            {weekDays.map((day) => (
              <Text key={day.iso} style={[styles.weekHeaderDay, day.isToday && styles.weekHeaderDayToday]}>
                {day.letter} {day.dayNumber}
              </Text>
            ))}
          </View>

          <View style={styles.weekGridRow}>
            <View style={[styles.hourGutter, { height: gridHeight }]}>
              {hourLabels.map((hourLabel) => (
                <Text key={hourLabel.label} style={[styles.hourLabel, { top: hourLabel.topPx }]}>
                  {hourLabel.label}
                </Text>
              ))}
            </View>
            {weekDays.map((day) => (
              <View key={day.iso} style={[styles.dayColumn, day.missedGoal && styles.dayColumnMissedGoal, { height: gridHeight }]}>
                {day.events.map((event, index) => {
                  const { topPx, heightPx } = getEventBlockPosition(event, HOUR_RANGE.start, ROW_HEIGHT);
                  return (
                    <View
                      key={index}
                      style={[
                        styles.eventBlock,
                        { top: topPx, height: heightPx },
                        event.status === 'done' ? styles.eventDone : styles.eventPlanned,
                      ]}
                    />
                  );
                })}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: {
    padding: spacing.xl,
    paddingTop: spacing.md,
    gap: spacing.xxl,
  },
  section: {
    gap: spacing.sm,
  },
  monthSection: {
    backgroundColor: colors.surface + '40',
    borderRadius: radius.md,
    padding: spacing.md,
    marginHorizontal: -spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  navButtons: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  todayButton: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: 11,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  todayButtonPressed: {
    opacity: 0.8,
  },
  todayButtonLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.accentOn,
  },
  chevronRight: {
    transform: [{ rotate: '180deg' }],
  },
  weekHeaderRow: {
    flexDirection: 'row',
    gap: spacing.xxs + 2,
  },
  weekHeaderDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    color: colors.textSecondary,
  },
  weekHeaderDayToday: {
    color: colors.accent,
    fontWeight: '700',
  },
  weekGridRow: {
    flexDirection: 'row',
    gap: spacing.xxs + 2,
  },
  hourGutter: {
    width: GUTTER_WIDTH,
    flexShrink: 0,
    position: 'relative',
  },
  hourLabel: {
    position: 'absolute',
    left: 0,
    right: 0,
    fontSize: 9,
    color: colors.textTertiary,
    transform: [{ translateY: -6 }],
  },
  dayColumn: {
    flex: 1,
    position: 'relative',
    backgroundColor: colors.surface + '80',
    borderRadius: 6,
  },
  dayColumnMissedGoal: {
    backgroundColor: colors.danger + '30',
  },
  eventBlock: {
    position: 'absolute',
    left: 2,
    right: 2,
    borderRadius: 4,
  },
  eventDone: {
    backgroundColor: colors.calendarDoneBg,
  },
  eventPlanned: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.accentDashed,
  },
  monthHeaderRow: {
    flexDirection: 'row',
  },
  monthHeaderLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    color: colors.textTertiary,
    paddingBottom: 2,
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    height: MONTH_CELL_HEIGHT * MONTH_ROWS,
  },
  monthCell: {
    width: `${100 / 7}%`,
    height: MONTH_CELL_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthCellFill: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.sm,
  },
  monthCellBadge: {
    width: MONTH_BADGE_SIZE,
    height: MONTH_BADGE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: MONTH_BADGE_SIZE / 2,
  },
  monthCellText: {
    fontSize: 13,
    fontWeight: '600',
  },
  legend: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginTop: spacing.xxs,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
