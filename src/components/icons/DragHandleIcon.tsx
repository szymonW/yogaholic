import Svg, { Circle } from 'react-native-svg';
import { colors } from '@/theme';
import type { IconProps } from './types';

const COLS = [5, 13];
const ROWS = [3, 9, 15];

export function DragHandleIcon({ size = 18, color = colors.textTertiary }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      {COLS.flatMap((cx) => ROWS.map((cy) => <Circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={1.4} fill={color} />))}
    </Svg>
  );
}
