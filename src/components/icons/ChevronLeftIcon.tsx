import Svg, { Path } from 'react-native-svg';
import { colors } from '@/theme';
import type { IconProps } from './types';

export function ChevronLeftIcon({ size = 18, color = colors.textPrimary, strokeWidth = 2.4 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 11 18" fill="none">
      <Path d="M9 2L2 9l7 7" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
