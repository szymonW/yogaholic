import Svg, { Path } from 'react-native-svg';
import { colors } from '@/theme';
import type { IconProps } from './types';

export function BookmarkIcon({ size = 26, color = colors.accent, strokeWidth = 2 }: IconProps) {
  const height = (size * 26) / 22;
  return (
    <Svg width={size} height={height} viewBox="0 0 22 26" fill="none">
      <Path d="M2 2h18v22l-9-6-9 6V2z" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
    </Svg>
  );
}
