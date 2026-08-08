import { View, type StyleProp, type ViewStyle } from 'react-native';
import { isCastSupported } from './support';

interface CastButtonSafeProps {
  style?: StyleProp<ViewStyle>;
  tintColor?: string;
}

/**
 * Renders react-native-google-cast's CastButton where it's actually supported, otherwise an
 * empty placeholder of the same size. Never statically imports the library — see
 * isCastSupported for why that alone would crash Expo Go and web.
 */
export function CastButtonSafe({ style, tintColor }: CastButtonSafeProps) {
  if (!isCastSupported) return <View style={style} />;
  // Must stay a runtime require, not a static import, so this line only executes when
  // isCastSupported is true.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { CastButton } = require('react-native-google-cast') as typeof import('react-native-google-cast');
  // CastButton's own style type awkwardly rejects a literal `null` (its `style` prop intersects
  // StyleProp<ViewStyle> with an object type, which collapses the `null` arm of the union to
  // `never`) — normalize to `undefined` rather than narrowing our own, more permissive prop type.
  return <CastButton style={style ?? undefined} tintColor={tintColor} />;
}
