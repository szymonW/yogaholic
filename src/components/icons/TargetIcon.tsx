import Svg, { Circle } from 'react-native-svg';
import { colors } from '@/theme';
import type { IconProps } from './types';

export function TargetIcon({ size = 26, color = colors.accent, strokeWidth = 1.6 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 26 26" fill="none">
      <Circle cx={13} cy={13} r={10} stroke={color} strokeWidth={strokeWidth} />
      <Circle cx={13} cy={13} r={6} stroke={color} strokeWidth={strokeWidth} />
      <Circle cx={13} cy={13} r={2} fill={color} />
    </Svg>
  );
}
