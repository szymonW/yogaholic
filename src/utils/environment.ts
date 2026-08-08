import Constants from 'expo-constants';

/**
 * True only in the plain Expo Go client — false in a custom dev-client build, a standalone
 * build, and on web. `appOwnership` is deprecated in favor of `executionEnvironment`, but unlike
 * it, `executionEnvironment` reports the same `StoreClient` value for both Expo Go *and* a
 * dev-client build, so it can't tell them apart. `appOwnership` is `'expo'` only for Expo Go.
 */
export const isExpoGo = Constants.appOwnership === 'expo';
