import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from '@/i18n';
import { colors, radius, spacing, typography } from '@/theme';
import { Button } from './Button';
import { ChevronLeftIcon } from './icons';
import { IconButton } from './IconButton';

interface TimePickerModalProps {
  visible: boolean;
  hour: number;
  minute: number;
  onSave: (hour: number, minute: number) => void;
  onCancel: () => void;
}

// Minute column moves in 5-minute increments (like a NumberPicker's arrow taps) — a reminder
// doesn't need minute precision, and 1-minute steps would take up to 59 taps to dial in.
const MINUTE_STEP = 5;

function pad(n: number) {
  return String(n).padStart(2, '0');
}

/** One HH or MM column: an up/down arrow either side of the big digit, à la Android's classic NumberPicker. */
function TimeColumn({ value, onInc, onDec, incA11y, decA11y }: { value: number; onInc: () => void; onDec: () => void; incA11y: string; decA11y: string }) {
  return (
    <View style={styles.column}>
      <IconButton accessibilityLabel={incA11y} onPress={onInc} size={40} backgroundColor={colors.background}>
        <View style={styles.chevronUp}>
          <ChevronLeftIcon size={16} />
        </View>
      </IconButton>
      <Text style={styles.digits}>{pad(value)}</Text>
      <IconButton accessibilityLabel={decA11y} onPress={onDec} size={40} backgroundColor={colors.background}>
        <View style={styles.chevronDown}>
          <ChevronLeftIcon size={16} />
        </View>
      </IconButton>
    </View>
  );
}

/**
 * Edits a draft hour/minute independent of the persisted setting — arrow taps only ever
 * change local state, so "Anuluj" can walk away with the store untouched and "Zapisz" is the
 * one path that commits (`onSave`).
 */
export function TimePickerModal({ visible, hour, minute, onSave, onCancel }: TimePickerModalProps) {
  const t = useTranslation();
  const [draftHour, setDraftHour] = useState(hour);
  const [draftMinute, setDraftMinute] = useState(minute);

  // Re-seed the draft from the persisted value each time the modal opens, so a previous
  // cancelled edit never leaks into the next time it's opened.
  useEffect(() => {
    if (visible) {
      setDraftHour(hour);
      setDraftMinute(minute);
    }
  }, [visible, hour, minute]);

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onCancel}>
      <Pressable style={[StyleSheet.absoluteFill, styles.backdrop]} onPress={onCancel} accessibilityLabel={t.common.cancel} />
      <View style={styles.centerWrap} pointerEvents="box-none">
        <View style={styles.card}>
          <Text style={[typography.bodyLg, styles.title]}>{t.goals.setReminderTime}</Text>
          <View style={styles.picker}>
            <TimeColumn
              value={draftHour}
              onInc={() => setDraftHour((h) => (h + 1) % 24)}
              onDec={() => setDraftHour((h) => (h + 23) % 24)}
              incA11y={t.stepButton.increaseA11y}
              decA11y={t.stepButton.decreaseA11y}
            />
            <Text style={styles.colon}>:</Text>
            <TimeColumn
              value={draftMinute}
              onInc={() => setDraftMinute((m) => (m + MINUTE_STEP) % 60)}
              onDec={() => setDraftMinute((m) => (m + 60 - MINUTE_STEP) % 60)}
              incA11y={t.stepButton.increaseA11y}
              decA11y={t.stepButton.decreaseA11y}
            />
          </View>
          <View style={styles.actions}>
            <Button title={t.common.cancel} variant="secondary" style={styles.flex1} onPress={onCancel} />
            <Button title={t.common.save} variant="primary" style={styles.flex1} onPress={() => onSave(draftHour, draftMinute)} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(56, 35, 28, 0.4)',
  },
  centerWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  card: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.lg,
  },
  title: {
    color: colors.textPrimary,
    textAlign: 'center',
  },
  picker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  column: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  digits: {
    fontSize: 44,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    color: colors.textPrimary,
    minWidth: 72,
    textAlign: 'center',
  },
  colon: {
    fontSize: 40,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xxl,
  },
  chevronUp: {
    transform: [{ rotate: '90deg' }],
  },
  chevronDown: {
    transform: [{ rotate: '-90deg' }],
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  flex1: {
    flex: 1,
  },
});
