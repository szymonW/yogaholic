import { View, type StyleProp, type ViewStyle } from 'react-native';
import { colors, radius as radiusTokens, spacing } from '@/theme';

interface CardProps {
  children: React.ReactNode;
  radius?: number;
  padding?: number;
  bordered?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Card({ children, radius = radiusTokens.xl, padding = spacing.lg, bordered = false, style }: CardProps) {
  return (
    <View
      style={[
        {
          backgroundColor: colors.surface,
          borderRadius: radius,
          padding,
          borderWidth: bordered ? 1 : 0,
          borderColor: colors.border,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
