// STUB — replaced by the real list screen in Faza 4.
import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { ScreenHeader } from '@/components';
import type { SequenceCategory } from '@/types';
import { colors, typography } from '@/theme';

const CATEGORY_LABELS: Record<SequenceCategory, string> = {
  recent: 'Ostatnio ćwiczone',
  saved: 'Zapisane sekwencje',
  sample: 'Przykładowe sekwencje',
  custom: 'Własne sekwencje',
};

export default function ListScreen() {
  const { category } = useLocalSearchParams<{ category: SequenceCategory }>();
  const label = CATEGORY_LABELS[category] ?? category;

  return (
    <View style={styles.root}>
      <ScreenHeader title={label} onBack={() => router.back()} />
      <View style={styles.content}>
        <Text style={typography.body}>Wkrótce — lista sekwencji.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
