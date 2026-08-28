import type { ReactNode } from 'react';
import { Image, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors } from '@/theme';

// Native pixel size of peace-bg.png (1280x1920) — used to scale it to full container height
// while keeping its aspect ratio, instead of letting resizeMode="cover" crop top/bottom.
const BG_ASPECT_RATIO = 1280 / 1920;

interface ScreenBackgroundProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function ScreenBackground({ children, style }: ScreenBackgroundProps) {
  return (
    <View style={styles.root}>
      <View style={styles.bgClip} pointerEvents="none">
        <Image source={require('../../assets/backgrounds/peace-bg.png')} style={styles.bg} resizeMode="cover" />
      </View>
      <View style={[styles.content, style]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  bgClip: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    overflow: 'hidden',
  },
  bg: {
    height: '100%',
    aspectRatio: BG_ASPECT_RATIO,
    opacity: 0.5,
  },
  content: {
    flex: 1,
  },
});
