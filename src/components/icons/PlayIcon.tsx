import Svg, { Path } from 'react-native-svg';
import { colors } from '@/theme';
import type { IconProps } from './types';

export function PlayIcon({ size = 22, color = colors.accentOn }: IconProps) {
  const height = (size * 20) / 18;
  return (
    <Svg width={size} height={height} viewBox="0 0 18 20" fill="none">
      <Path d="M2 1l15 9-15 9V1z" fill={color} />
    </Svg>
  );
}
