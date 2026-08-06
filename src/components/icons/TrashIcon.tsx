import Svg, { Path } from 'react-native-svg';
import { colors } from '@/theme';
import type { IconProps } from './types';

export function TrashIcon({ size = 16, color = colors.danger, strokeWidth = 1.6 }: IconProps) {
  const height = (size * 18) / 16;
  return (
    <Svg width={size} height={height} viewBox="0 0 16 18" fill="none">
      <Path
        d="M1 4h14M6 4V2h4v2M3 4l1 13h8l1-13"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M6 7.5v6M10 7.5v6" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
    </Svg>
  );
}
