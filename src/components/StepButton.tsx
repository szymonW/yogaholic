import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';
import { useHoldRepeat } from '@/hooks/useHoldRepeat';
import { useTranslation } from '@/i18n';
import { colors, radius } from '@/theme';

interface StepButtonProps {
  label: '−' | '+';
  onStep: () => void;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

/** A tap steps once; holding it down keeps stepping on an interval until released. */
export function StepButton({ label, onStep, style, accessibilityLabel }: StepButtonProps) {
  const { onPressIn, onPressOut, onPress } = useHoldRepeat(onStep);
  const t = useTranslation();

  return (
    <Pressable
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? (label === '+' ? t.stepButton.increaseA11y : t.stepButton.decreaseA11y)}
      style={[styles.base, style]}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: 28,
    height: 28,
    borderRadius: radius.xs,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    color: colors.textPrimary,
  },
});
