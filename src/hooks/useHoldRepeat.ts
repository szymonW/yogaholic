import { useCallback, useRef } from 'react';

const HOLD_DELAY_MS = 400;
const REPEAT_INTERVAL_MS = 100;

/**
 * Wires up a stepper button so a single tap fires `onStep` once (via onPress, as
 * usual) while holding the button down keeps firing it on an interval. The final
 * onPress after a hold is swallowed so releasing doesn't apply one extra step.
 */
export function useHoldRepeat(onStep: () => void) {
  const stepRef = useRef(onStep);
  stepRef.current = onStep;

  const holdTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const repeatInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const didRepeat = useRef(false);

  const clearTimers = useCallback(() => {
    if (holdTimeout.current) clearTimeout(holdTimeout.current);
    if (repeatInterval.current) clearInterval(repeatInterval.current);
    holdTimeout.current = null;
    repeatInterval.current = null;
  }, []);

  const onPressIn = useCallback(() => {
    didRepeat.current = false;
    holdTimeout.current = setTimeout(() => {
      didRepeat.current = true;
      stepRef.current();
      repeatInterval.current = setInterval(() => {
        stepRef.current();
      }, REPEAT_INTERVAL_MS);
    }, HOLD_DELAY_MS);
  }, []);

  const onPressOut = useCallback(() => {
    clearTimers();
  }, [clearTimers]);

  const onPress = useCallback(() => {
    if (didRepeat.current) {
      didRepeat.current = false;
      return;
    }
    stepRef.current();
  }, []);

  return { onPressIn, onPressOut, onPress };
}
