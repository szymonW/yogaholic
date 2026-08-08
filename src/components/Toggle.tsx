import { StyleSheet, View } from 'react-native';
import { colors } from '@/theme';

interface ToggleProps {
  value: boolean;
  testID?: string;
}

const TRACK_WIDTH = 44;
const TRACK_HEIGHT = 26;
const THUMB_SIZE = 20;

/**
 * Purely visual on/off indicator — no press handler of its own. Meant to sit inside an
 * already-tappable row (e.g. SettingsRow) so a single Pressable owns the touch instead of
 * nesting two responders.
 */
export function Toggle({ value, testID }: ToggleProps) {
  return (
    <View testID={testID} style={[styles.track, { backgroundColor: value ? colors.accent : colors.border }]}>
      <View style={[styles.thumb, value ? styles.thumbOn : styles.thumbOff]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: colors.surfaceAlt,
  },
  thumbOn: {
    alignSelf: 'flex-end',
  },
  thumbOff: {
    alignSelf: 'flex-start',
  },
});
