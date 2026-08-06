import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { colors } from '@/theme';

interface IconButtonProps {
  onPress?: () => void;
  children: React.ReactNode;
  accessibilityLabel: string;
  size?: number;
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
}

export function IconButton({
  onPress,
  children,
  accessibilityLabel,
  size = 36,
  backgroundColor = colors.surface,
  style,
}: IconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={8}
      style={({ pressed }) => [
        styles.base,
        { width: size, height: size, borderRadius: size / 2, backgroundColor, opacity: pressed ? 0.7 : 1 },
        style,
      ]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
