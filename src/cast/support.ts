import { Platform } from 'react-native';
import { isExpoGo } from '@/utils/environment';

/**
 * True only where react-native-google-cast's native module is actually linked and usable: a
 * dev-client build (`npx expo run` / EAS dev build) or a standalone/production build, on
 * iOS/Android. False in Expo Go (the native module isn't bundled there) and on web
 * (react-native-web doesn't implement the native view registration the library needs at import
 * time). In both false cases, merely `import`-ing the library crashes — not just calling into it
 * — so every cast entry point must check this *before* requiring the module, not just before
 * rendering/calling into it.
 */
export const isCastSupported = !isExpoGo && Platform.OS !== 'web';
