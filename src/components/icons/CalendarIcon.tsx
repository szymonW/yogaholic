import Svg, { Path, Rect } from 'react-native-svg';
import { colors } from '@/theme';
import type { IconProps } from './types';

export function CalendarIcon({ size = 26, color = colors.accent, strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 26 26" fill="none">
      <Rect x={3} y={5} width={20} height={18} rx={3} stroke={color} strokeWidth={strokeWidth} />
      <Path d="M3 10h20" stroke={color} strokeWidth={strokeWidth} />
      <Path d="M8 2v5M18 2v5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}
