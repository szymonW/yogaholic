const { withAndroidManifest } = require('@expo/config-plugins');

// Android 13+ (API 33) requires the runtime NEARBY_WIFI_DEVICES permission for Wi-Fi-based
// device discovery (mDNS), which is how react-native-google-cast finds Chromecasts on the
// network. The library doesn't declare this itself, so without it discovery silently returns
// zero devices on Android 13+. `neverForLocation` is asserted because we never derive physical
// location from scan results, which means the app does NOT also need ACCESS_FINE_LOCATION.
module.exports = function withCastNearbyWifiPermission(config) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults.manifest;
    manifest['uses-permission'] = manifest['uses-permission'] || [];

    const alreadyDeclared = manifest['uses-permission'].some(
      (item) => item.$ && item.$['android:name'] === 'android.permission.NEARBY_WIFI_DEVICES'
    );

    if (!alreadyDeclared) {
      manifest['uses-permission'].push({
        $: {
          'android:name': 'android.permission.NEARBY_WIFI_DEVICES',
          'android:usesPermissionFlags': 'neverForLocation',
        },
      });
    }

    return config;
  });
};
