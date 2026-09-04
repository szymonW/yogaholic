import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from '@/i18n';
import { colors, radius, spacing } from '@/theme';
import { BookmarkIcon, TrashIcon } from './icons';

interface SequenceCardProps {
  title: string;
  subtitle: string;
  lastLabel?: string;
  onStart: () => void;
  onOpenDetail: () => void;
  /** Custom sequences can be edited; built-in ones only get a read-only detail view. */
  isEditable: boolean;
  /** Only shown (and the sequence deletable) when provided — custom sequences only. */
  onDelete?: () => void;
  /** Whether the sequence is in the user's favorites. */
  isFavorite?: boolean;
  /** Only shown when provided — toggles the sequence's favorite status. */
  onToggleFavorite?: () => void;
  /** Repetition multiplier (x1–x9) the sequence will run at. Defaults to 1. */
  repeatCount?: number;
  /** Only shown (and the multiplier cyclable) when provided — advances repeatCount, wrapping from x9 back to x1. */
  onChangeRepeatCount?: () => void;
}

export function SequenceCard({
  title,
  subtitle,
  lastLabel,
  onStart,
  onOpenDetail,
  isEditable,
  onDelete,
  isFavorite,
  onToggleFavorite,
  repeatCount = 1,
  onChangeRepeatCount,
}: SequenceCardProps) {
  const t = useTranslation();
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        {onToggleFavorite ? (
          <Pressable
            onPress={onToggleFavorite}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={isFavorite ? t.sequenceCard.removeFavoriteA11y(title) : t.sequenceCard.addFavoriteA11y(title)}
            style={({ pressed }) => [styles.favoriteButton, pressed && styles.pressed]}
          >
            <BookmarkIcon size={22} filled={isFavorite} color={isFavorite ? colors.accent : colors.textTertiary} />
          </Pressable>
        ) : null}
      </View>
      {lastLabel ? <Text style={styles.lastLabel}>{t.sequenceCard.lastPracticed(lastLabel)}</Text> : null}
      <View style={styles.actions}>
        <Pressable onPress={onStart} style={({ pressed }) => [styles.startButton, pressed && styles.pressed]}>
          <Text style={styles.startLabel}>{t.sequenceCard.start}</Text>
        </Pressable>
        <Pressable onPress={onOpenDetail} style={({ pressed }) => [styles.detailButton, pressed && styles.pressed]}>
          <Text style={styles.detailLabel}>{isEditable ? t.sequenceCard.edit : t.sequenceCard.details}</Text>
        </Pressable>
        {onChangeRepeatCount ? (
          <Pressable
            onPress={onChangeRepeatCount}
            accessibilityRole="button"
            accessibilityLabel={t.sequenceCard.repeatCountA11y(repeatCount)}
            style={({ pressed }) => [styles.repeatButton, pressed && styles.pressed]}
          >
            <Text style={styles.repeatLabel}>{t.sequenceCard.repeatCountLabel(repeatCount)}</Text>
          </Pressable>
        ) : null}
        {onDelete ? (
          <Pressable
            onPress={onDelete}
            accessibilityRole="button"
            accessibilityLabel={t.sequenceCard.deleteA11y(title)}
            style={({ pressed }) => [styles.deleteButton, pressed && styles.pressed]}
          >
            <TrashIcon />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headerText: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  favoriteButton: {
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lastLabel: {
    fontSize: 12,
    color: colors.accent,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xxs,
  },
  pressed: {
    opacity: 0.8,
  },
  startButton: {
    flex: 1,
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: 11,
    alignItems: 'center',
  },
  startLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.accentOn,
  },
  detailButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: 11,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  deleteButton: {
    width: 42,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  repeatButton: {
    width: 42,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  repeatLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});
