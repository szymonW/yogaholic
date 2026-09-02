import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from '@/i18n';
import { colors, spacing, typography } from '@/theme';
import { ChevronLeftIcon } from './icons';
import { IconButton } from './IconButton';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  onBack: () => void;
  /** h1 (30px) is used by section screens, h2 (28px) by detail/create screens with a subtitle. */
  size?: 'h1' | 'h2';
  /** Optional control rendered on the same line as the title, right-aligned (e.g. a "Today" button). */
  action?: ReactNode;
}

export function ScreenHeader({ title, subtitle, onBack, size = 'h1', action }: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();
  const t = useTranslation();

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.md }]}>
      <View style={styles.headerRow}>
        <IconButton onPress={onBack} accessibilityLabel={t.screenHeader.backA11y}>
          <ChevronLeftIcon />
        </IconButton>
        <View style={styles.titleRow}>
          <Text style={[typography[size], styles.title]}>{title}</Text>
          {action}
        </View>
      </View>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  titleRow: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
