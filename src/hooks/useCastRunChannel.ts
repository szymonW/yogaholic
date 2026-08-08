import { useCallback } from 'react';
import { CastState, useCastChannel, useCastState } from 'react-native-google-cast';
import { RUN_CAST_NAMESPACE, type CastMessage } from '@/cast/payload';

/** Tracks the Cast connection and exposes a sender bound to the run-state channel. */
export function useCastRunChannel() {
  const castState = useCastState();
  const isCasting = castState === CastState.CONNECTED;
  const channel = useCastChannel(RUN_CAST_NAMESPACE);

  const sendRunState = useCallback(
    (message: CastMessage) => {
      if (!isCasting || !channel) return;
      channel.sendMessage(message);
    },
    [isCasting, channel]
  );

  return { isCasting, sendRunState };
}
