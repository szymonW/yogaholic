import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from '@/i18n';
import { colors, radius, spacing, typography } from '@/theme';
import { ChevronLeftIcon, CloseIcon } from './icons';
import { IconButton } from './IconButton';

interface TimePickerModalProps {
  visible: boolean;
  hour: number;
  minute: number;
  onIncHour: () => void;
  onDecHour: () => void;
  onIncMinute: () => void;
  onDecMinute: () => void;
  onClose: () => void;
}

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

export function TimePickerModal({ visible, hour, minute, onIncHour, onDecHour, onIncMinute, onDecMinute, onClose }: TimePickerModalProps) {
  const t = useTranslation();
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable style={[StyleSheet.absoluteFill, styles.backdrop]} onPress={onClose} accessibilityLabel={t.common.close} />
      <View style={styles.centerWrap} pointerEvents="box-none">
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={[typography.bodyLg, styles.title]}>{t.goals.setReminderTime}</Text>
            <IconButton accessibilityLabel={t.common.close} onPress={onClose} size={32}>
              <CloseIcon />
            </IconButton>
          </View>
          <View style={styles.picker}>
            <TimeColumn
              value={hour}
              onInc={onIncHour}
              onDec={onDecHour}
              incA11y={t.stepButton.increaseA11y}
              decA11y={t.stepButton.decreaseA11y}
            />
            <Text style={styles.colon}>:</Text>
            <TimeColumn
              value={minute}
              onInc={onIncMinute}
              onDec={onDecMinute}
              incA11y={t.stepButton.increaseA11y}
              decA11y={t.stepButton.decreaseA11y}
            />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xs,
  },
  title: {
    color: colors.textPrimary,
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
});
