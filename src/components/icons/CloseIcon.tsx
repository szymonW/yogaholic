import Svg, { Path } from 'react-native-svg';
import { colors } from '@/theme';
import type { IconProps } from './types';

export function CloseIcon({ size = 16, color = colors.textPrimary, strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path d="M2 2l12 12M14 2L2 14" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}
