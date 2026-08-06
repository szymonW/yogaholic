import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '@/theme';
import { TrashIcon } from './icons';

interface SequenceCardProps {
  title: string;
  subtitle: string;
  lastLabel?: string;
  onStart: () => void;
  onOpenDetail: () => void;
  /** Only shown (and the sequence deletable) when provided — custom sequences only. */
  onDelete?: () => void;
}

export function SequenceCard({ title, subtitle, lastLabel, onStart, onOpenDetail, onDelete }: SequenceCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      {lastLabel ? <Text style={styles.lastLabel}>Ostatnio: {lastLabel}</Text> : null}
      <View style={styles.actions}>
        <Pressable onPress={onStart} style={({ pressed }) => [styles.startButton, pressed && styles.pressed]}>
          <Text style={styles.startLabel}>Start</Text>
        </Pressable>
        <Pressable onPress={onOpenDetail} style={({ pressed }) => [styles.detailButton, pressed && styles.pressed]}>
          <Text style={styles.detailLabel}>Edytuj</Text>
        </Pressable>
        {onDelete ? (
          <Pressable
            onPress={onDelete}
            accessibilityRole="button"
            accessibilityLabel={`Usuń ${title}`}
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
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
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
});
