import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '@/theme';
import { ChevronLeftIcon } from './icons';
import { IconButton } from './IconButton';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  onBack: () => void;
  /** h1 (30px) is used by section screens, h2 (28px) by detail/create screens with a subtitle. */
  size?: 'h1' | 'h2';
}

export function ScreenHeader({ title, subtitle, onBack, size = 'h1' }: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.md }]}>
      <IconButton onPress={onBack} accessibilityLabel="Wstecz">
        <ChevronLeftIcon />
      </IconButton>
      <Text style={[typography[size], styles.title]}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: spacing.lg - 2,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
  },
  title: {
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: -spacing.sm,
  },
});
