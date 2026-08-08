import { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors } from '@/theme';

interface RingTimerProps {
  /** 0–1 */
  progress: number;
  size?: number;
  strokeWidth?: number;
  /** Changing this value (e.g. once per countdown second) pulses the ring's opacity. */
  blinkKey?: number | string;
  children?: React.ReactNode;
}

export function RingTimer({ progress, size = 264, strokeWidth = 7, blinkKey, children }: RingTimerProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(1, Math.max(0, progress));
  const center = size / 2;
  const innerSize = size - strokeWidth * 2;

  const ringOpacity = useRef(new Animated.Value(1)).current;
  const isFirstBlink = useRef(true);

  useEffect(() => {
    if (blinkKey === undefined) return;
    if (isFirstBlink.current) {
      isFirstBlink.current = false;
      return;
    }
    ringOpacity.setValue(1);
    Animated.sequence([
      Animated.timing(ringOpacity, { toValue: 0.25, duration: 150, useNativeDriver: true }),
      Animated.timing(ringOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
    ]).start();
  }, [blinkKey, ringOpacity]);

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={{ position: 'absolute', opacity: ringOpacity }}>
        <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
          <Circle cx={center} cy={center} r={radius} stroke={colors.ringTrack} strokeWidth={strokeWidth} fill="none" />
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={colors.accent}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={circumference * (1 - clamped)}
          />
        </Svg>
      </Animated.View>
      <View
        style={{
          width: innerSize,
          height: innerSize,
          borderRadius: innerSize / 2,
          backgroundColor: colors.ringInner,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {children}
      </View>
    </View>
  );
}
