import { router } from 'expo-router';

/**
 * Safe back navigation. `router.back()` throws/warns when the screen was reached
 * without any history (e.g. a deep link straight into a nested route), so this
 * falls back to replacing with Home instead of leaving the user stuck.
 */
export function goBack() {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace('/');
  }
}
