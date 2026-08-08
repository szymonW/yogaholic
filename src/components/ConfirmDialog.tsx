import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '@/theme';
import { Button } from './Button';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = 'Usuń',
  cancelLabel = 'Anuluj',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onCancel}>
      <Pressable style={[StyleSheet.absoluteFill, styles.backdrop]} onPress={onCancel} accessibilityLabel="Zamknij" />
      <View style={styles.centerWrap} pointerEvents="box-none">
        <View style={styles.card}>
          <Text style={[typography.bodyLg, styles.title]}>{title}</Text>
          {message ? <Text style={styles.message}>{message}</Text> : null}
          <View style={styles.actions}>
            <Button title={cancelLabel} variant="secondary" style={styles.flex1} onPress={onCancel} />
            <Button title={confirmLabel} variant="danger" style={styles.flex1} onPress={onConfirm} />
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
    maxWidth: 360,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.xl,
    padding: spacing.xl,
    gap: spacing.md,
  },
  title: {
    color: colors.textPrimary,
  },
  message: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xxs,
  },
  flex1: {
    flex: 1,
  },
});
