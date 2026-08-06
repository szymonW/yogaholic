// STUB — replaced by the real calendar screen in Faza 6.
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { ScreenHeader } from '@/components';
import { colors, typography } from '@/theme';

export default function CalendarScreen() {
  return (
    <View style={styles.root}>
      <ScreenHeader title="Kalendarz" onBack={() => router.back()} />
      <View style={styles.content}>
        <Text style={typography.body}>Wkrótce — kalendarz treningów.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
