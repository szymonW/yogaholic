import Svg, { Circle, Path } from 'react-native-svg';
import { colors } from '@/theme';
import type { IconProps } from './types';

export function CheckIcon({ size = 44, color = colors.accent, strokeWidth = 2.5 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 46 46" fill="none">
      <Circle cx={23} cy={23} r={21} stroke={color} strokeWidth={strokeWidth} />
      <Path d="M14 24l6 6 12-14" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
