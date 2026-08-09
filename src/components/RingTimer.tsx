import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, View } from 'react-native';
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

  const [ringOpacity] = useState(() => new Animated.Value(1));
  const isFirstBlink = useRef(true);

  // Ticks arrive once per second, but interpolating toward each new value over that same
  // second (instead of snapping) makes the fill read as continuous motion rather than a
  // once-a-second jump. Backward jumps (new exercise, skip) snap instantly instead —
  // animating those would look like the ring rewinding.
  //
  // Driven via setNativeProps (rather than Animated.createAnimatedComponent) because
  // react-native-web's Animated HOC injects a `collapsable` prop meant for Views, which
  // react-native-svg's web Circle forwards straight to the DOM as an invalid SVG attribute.
  const [progressAnim] = useState(() => new Animated.Value(clamped));
  const prevProgress = useRef(clamped);
  const progressCircleRef = useRef<Circle>(null);

  useEffect(() => {
    const id = progressAnim.addListener(({ value }) => {
      progressCircleRef.current?.setNativeProps({ strokeDashoffset: circumference * (1 - value) });
    });
    return () => progressAnim.removeListener(id);
  }, [progressAnim, circumference]);

  useEffect(() => {
    const prev = prevProgress.current;
    prevProgress.current = clamped;
    if (clamped < prev - 0.001) {
      progressAnim.setValue(clamped);
      return;
    }
    Animated.timing(progressAnim, {
      toValue: clamped,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, [clamped, progressAnim]);

  const [initialStrokeDashoffset] = useState(() => circumference * (1 - clamped));

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
            ref={progressCircleRef}
            cx={center}
            cy={center}
            r={radius}
            stroke={colors.accent}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={initialStrokeDashoffset}
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
