import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LANGUAGE_OPTIONS, useTranslation } from '@/i18n';
import { colors, radius, spacing, typography } from '@/theme';
import { CheckIcon, CloseIcon } from './icons';
import { IconButton } from './IconButton';

interface LanguagePickerModalProps {
  visible: boolean;
  selectedCode: string;
  onSelect: (code: string) => void;
  onClose: () => void;
}

export function LanguagePickerModal({ visible, selectedCode, onSelect, onClose }: LanguagePickerModalProps) {
  const t = useTranslation();
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable style={[StyleSheet.absoluteFill, styles.backdrop]} onPress={onClose} accessibilityLabel={t.common.close} />
      <View style={styles.centerWrap} pointerEvents="box-none">
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={[typography.bodyLg, styles.title]}>{t.languagePicker.title}</Text>
            <IconButton accessibilityLabel={t.common.close} onPress={onClose} size={32}>
              <CloseIcon />
            </IconButton>
          </View>
          <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
            {LANGUAGE_OPTIONS.map((option, index) => {
              const isSelected = option.code === selectedCode;
              const isLast = index === LANGUAGE_OPTIONS.length - 1;
              return (
                <Pressable
                  key={option.code}
                  onPress={option.available ? () => onSelect(option.code) : undefined}
                  disabled={!option.available}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected, disabled: !option.available }}
                  style={({ pressed }) => [
                    styles.row,
                    !isLast && styles.rowBorder,
                    pressed && option.available && styles.rowPressed,
                  ]}
                >
                  <Text style={[styles.rowLabel, !option.available && styles.rowLabelDisabled]} numberOfLines={1}>
                    {option.label}
                  </Text>
                  {isSelected ? (
                    <CheckIcon size={22} strokeWidth={2} color={colors.success} />
                  ) : !option.available ? (
                    <Text style={styles.rowBadge} numberOfLines={1}>
                      {t.languagePicker.comingSoon}
                    </Text>
                  ) : null}
                </Pressable>
              );
            })}
          </ScrollView>
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
    maxHeight: '80%',
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xs,
    paddingBottom: spacing.xxs,
  },
  title: {
    color: colors.textPrimary,
  },
  list: {
    flexGrow: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    paddingVertical: 14,
    paddingHorizontal: spacing.xs,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowPressed: {
    opacity: 0.6,
  },
  // The label owns the leftover width so it is the only thing that can ever give; the badge and
  // the check keep their intrinsic size. Without this both children shrink together and each
  // loses its last characters ("wkrótce" → "wkrótc") once the OS font scale grows the row.
  rowLabel: {
    flex: 1,
    minWidth: 0,
    fontSize: 16,
    color: colors.textPrimary,
  },
  rowLabelDisabled: {
    color: colors.textFaint,
  },
  rowBadge: {
    flexShrink: 0,
    fontSize: 13,
    color: colors.textFaint,
  },
});
