import Svg, { Circle, Path } from 'react-native-svg';
import { colors } from '@/theme';
import type { IconProps } from './types';

export function ClockIcon({ size = 26, color = colors.accent, strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 26 26" fill="none">
      <Circle cx={13} cy={13} r={10} stroke={color} strokeWidth={strokeWidth} />
      <Path d="M13 7v6l4 3" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}
