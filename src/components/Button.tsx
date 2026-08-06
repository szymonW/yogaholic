import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';
import { colors, radius } from '@/theme';

type Variant = 'primary' | 'secondary' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

const SIZE_STYLES: Record<Size, { paddingVertical: number; fontSize: number; borderRadius: number }> = {
  sm: { paddingVertical: 11, fontSize: 14, borderRadius: radius.md },
  md: { paddingVertical: 11, fontSize: 15, borderRadius: radius.md },
  lg: { paddingVertical: 15, fontSize: 17, borderRadius: radius.lg },
};

export function Button({ title, onPress, variant = 'primary', size = 'md', disabled = false, style }: ButtonProps) {
  const sizeStyle = SIZE_STYLES[size];
  const isPrimary = variant === 'primary';
  const isDanger = variant === 'danger';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.base,
        {
          paddingVertical: sizeStyle.paddingVertical,
          borderRadius: sizeStyle.borderRadius,
          backgroundColor: isPrimary ? colors.accent : 'transparent',
          borderWidth: isPrimary ? 0 : 1,
          borderColor: isDanger ? colors.border : colors.border,
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          {
            fontSize: sizeStyle.fontSize,
            color: isPrimary ? colors.accentOn : isDanger ? colors.danger : colors.textPrimary,
          },
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontWeight: '600',
  },
});
