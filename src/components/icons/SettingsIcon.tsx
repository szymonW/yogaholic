import Svg, { Circle, Line } from 'react-native-svg';
import { colors } from '@/theme';
import type { IconProps } from './types';

const ROWS = [
  { y: 5, knobX: 13 },
  { y: 10, knobX: 7 },
  { y: 15, knobX: 14 },
];

export function SettingsIcon({ size = 19, color = colors.textPrimary, strokeWidth = 1.6 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20">
      {ROWS.flatMap(({ y, knobX }) => [
        <Line key={`line-${y}`} x1={2} y1={y} x2={18} y2={y} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />,
        <Circle key={`knob-${y}`} cx={knobX} cy={y} r={2.3} fill={colors.background} stroke={color} strokeWidth={strokeWidth} />,
      ])}
    </Svg>
  );
}
