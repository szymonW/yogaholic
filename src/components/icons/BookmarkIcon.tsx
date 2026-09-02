import Svg, { Path } from 'react-native-svg';
import { colors } from '@/theme';
import type { IconProps } from './types';

interface BookmarkIconProps extends IconProps {
  /** Solid fill for an active/favorited state; outline only otherwise. */
  filled?: boolean;
}

export function BookmarkIcon({ size = 26, color = colors.accent, strokeWidth = 2, filled = false }: BookmarkIconProps) {
  const height = (size * 26) / 22;
  return (
    <Svg width={size} height={height} viewBox="0 0 22 26" fill="none">
      <Path d="M2 2h18v22l-9-6-9 6V2z" fill={filled ? color : 'none'} stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
    </Svg>
  );
}
