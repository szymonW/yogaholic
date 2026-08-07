import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ScreenHeader } from '@/components';
import { useHistoryStore } from '@/store';
import { colors, radius, spacing } from '@/theme';
import {
  computeHourRange,
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

const ROW_HEIGHT = 11;
const GUTTER_WIDTH = 26;
// No scheduling feature exists yet, so there is nothing real to mark as "planned" —
// left empty rather than inventing sessions the user never actually planned.
const PLANNED_DAYS = new Set<number>();

const MONTH_CELL_STYLES: Record<MonthCellState, { backgroundColor: string; borderColor?: string; borderStyle?: 'dashed'; textColor: string }> = {
  empty: { backgroundColor: 'transparent', textColor: 'transparent' },
  today: { backgroundColor: colors.accent, textColor: colors.accentOn },
  done: { backgroundColor: colors.calendarDoneBg + '48', textColor: colors.textPrimary },
  missed: { backgroundColor: 'transparent', textColor: colors.textFaint },
  planned: { backgroundColor: 'transparent', borderColor: colors.accentDashed, borderStyle: 'dashed', textColor: colors.textPrimary },
  rest: { backgroundColor: 'transparent', textColor: colors.textTertiary },
};

export default function CalendarScreen() {
  const entries = useHistoryStore((state) => state.entries);
  const today = new Date();

  const eventsByDate = historyToDayEvents(entries);
  const weekDays = getWeekDays(today, eventsByDate);
  const hourRange = computeHourRange(weekDays.flatMap((day) => day.events));
  const hourLabels = getHourLabels(hourRange.start, hourRange.end, ROW_HEIGHT);
  const gridHeight = (hourRange.end - hourRange.start) * ROW_HEIGHT;

  const doneDays = getDoneDaysInMonth(entries, today);
  const monthCells = getMonthCells(today, doneDays, PLANNED_DAYS);

  return (
    <View style={styles.root}>
      <ScreenHeader title="Kalendarz" onBack={goBack} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Ten tydzień</Text>

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
              <View key={day.iso} style={[styles.dayColumn, { height: gridHeight }]}>
                {day.events.map((event, index) => {
                  const { topPx, heightPx } = getEventBlockPosition(event, hourRange.start, ROW_HEIGHT);
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

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{getMonthLabel(today)}</Text>
          <View style={styles.monthHeaderRow}>
            {['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'].map((label) => (
              <Text key={label} style={styles.monthHeaderLabel}>
                {label}
              </Text>
            ))}
          </View>
          <View style={styles.monthGrid}>
            {monthCells.map((cell, index) => {
              const cellStyle = MONTH_CELL_STYLES[cell.state];
              return (
                <View
                  key={index}
                  style={[
                    styles.monthCell,
                    {
                      backgroundColor: cellStyle.backgroundColor,
                      borderColor: cellStyle.borderColor,
                      borderStyle: cellStyle.borderStyle,
                      borderWidth: cellStyle.borderColor ? 1.5 : 0,
                    },
                  ]}
                >
                  {cell.day !== null ? <Text style={[styles.monthCellText, { color: cellStyle.textColor }]}>{cell.day}</Text> : null}
                </View>
              );
            })}
          </View>
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.calendarDoneBg + '48' }]} />
              <Text style={styles.legendLabel}>Wykonane</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.accentDashed }]} />
              <Text style={styles.legendLabel}>Zaplanowane</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: {
    padding: spacing.xl,
    paddingTop: spacing.md,
    gap: spacing.xxl,
  },
  section: {
    gap: spacing.sm,
  },
  sectionLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
    backgroundColor: colors.surface,
    borderRadius: 6,
  },
  eventBlock: {
    position: 'absolute',
    left: 2,
    right: 2,
    borderRadius: 4,
  },
  eventDone: {
    backgroundColor: colors.accent,
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
  },
  monthCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.sm,
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
