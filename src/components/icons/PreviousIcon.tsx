import Svg, { Path } from 'react-native-svg';
import { colors } from '@/theme';
import type { IconProps } from './types';

export function PreviousIcon({ size = 16, color = colors.textPrimary, strokeWidth = 2 }: IconProps) {
  const height = (size * 16) / 20;
  return (
    <Svg width={size} height={height} viewBox="0 0 20 16" fill="none">
      <Path
        d="M19 1l-7 7 7 7M9 1l-7 7 7 7"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
