import Svg, { Rect } from 'react-native-svg';
import { colors } from '@/theme';
import type { IconProps } from './types';

export function PauseIcon({ size = 20, color = colors.accentOn }: IconProps) {
  const height = (size * 24) / 18;
  return (
    <Svg width={size} height={height} viewBox="0 0 18 20" fill="none">
      <Rect x={1} y={1} width={5} height={18} rx={1.5} fill={color} />
      <Rect x={12} y={1} width={5} height={18} rx={1.5} fill={color} />
    </Svg>
  );
}
