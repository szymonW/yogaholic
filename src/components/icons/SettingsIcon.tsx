import Svg, { Circle, Rect } from 'react-native-svg';
import { colors } from '@/theme';
import type { IconProps } from './types';

const ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

export function SettingsIcon({ size = 20, color = colors.textPrimary, strokeWidth = 1.7 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20">
      <Circle cx={10} cy={10} r={5.4} fill="none" stroke={color} strokeWidth={strokeWidth} />
      <Circle cx={10} cy={10} r={1.8} fill={color} />
      {ANGLES.map((angle) => (
        <Rect
          key={angle}
          x={9}
          y={0.8}
          width={2}
          height={2.6}
          rx={0.6}
          fill={color}
          transform={`rotate(${angle} 10 10)`}
        />
      ))}
    </Svg>
  );
}
