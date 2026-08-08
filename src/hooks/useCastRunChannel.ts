import { useCallback, useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { isCastSupported } from '@/cast/support';
import { RUN_CAST_NAMESPACE, type CastMessage } from '@/cast/payload';

/**
 * Tracks the Cast connection and exposes a sender bound to the run-state channel.
 *
 * Which implementation this resolves to is fixed for the process's lifetime (isCastSupported
 * can't change while running), so switching the exported hook itself at module-eval time is
 * safe and keeps the disabled path from ever touching react-native-google-cast.
 */
export const useCastRunChannel = isCastSupported ? useCastRunChannelNative : useCastRunChannelDisabled;

function useCastRunChannelNative() {
  // Required lazily, not statically imported: this function only ever runs when isCastSupported
  // is true (see the export above), whereas a static import would always run.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { CastState, useCastChannel, useCastState } = require('react-native-google-cast') as typeof import('react-native-google-cast');

  // Android 13+ requires this runtime permission for Wi-Fi-based Cast device discovery — without
  // it, react-native-google-cast silently finds zero devices. See plugins/withCastNearbyWifiPermission.js
  // for the matching manifest declaration.
  useEffect(() => {
    if (Platform.OS !== 'android' || Platform.Version < 33) return;
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.NEARBY_WIFI_DEVICES);
  }, []);

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

function useCastRunChannelDisabled() {
  return { isCasting: false, sendRunState: () => {} };
}
