import Svg, { Path } from 'react-native-svg';
import { colors } from '@/theme';
import type { IconProps } from './types';

export function SparkleIcon({ size = 26, color = colors.accent, strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 26 26" fill="none">
      <Path d="M13 2v22M2 13h22M5 5l16 16M21 5L5 21" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}
