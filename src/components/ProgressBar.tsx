import { View, type StyleProp, type ViewStyle } from 'react-native';
import { colors, radius } from '@/theme';

interface ProgressBarProps {
  /** 0–1 */
  progress: number;
  height?: number;
  trackColor?: string;
  fillColor?: string;
  style?: StyleProp<ViewStyle>;
}

export function ProgressBar({
  progress,
  height = 8,
  trackColor = colors.background,
  fillColor = colors.accent,
  style,
}: ProgressBarProps) {
  const clamped = Math.min(1, Math.max(0, progress));

  return (
    <View style={[{ height, borderRadius: radius.full, backgroundColor: trackColor, overflow: 'hidden' }, style]}>
      <View style={{ height: '100%', width: `${clamped * 100}%`, backgroundColor: fillColor }} />
    </View>
  );
}
