import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEngine } from '@/lib/engine';
import { colors, radius, spacing, typography } from '@/lib/theme';
import { Button } from '@/components/Button';

export default function SettingsScreen() {
  const { clearTokens } = useEngine();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.content}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Phase 1. Skills, downloader rights and Paperclip arrive in later phases.</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Engine connection</Text>
          <Text style={styles.cardBody}>
            The app talks to the engine on this phone only (127.0.0.1:8787). No cloud, no accounts.
          </Text>
          <Button label="Unpair from engine" variant="danger" onPress={() => void clearTokens()} style={{ marginTop: spacing.m }} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Manual mode</Text>
          <Text style={styles.cardBody}>
            If the Codex sign-in fails in Termux, later phases fall back to manual mode: the app shows a ready prompt, you paste it into ChatGPT, and paste the plan back. Never a paid API.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.m, gap: spacing.m },
  title: { ...typography.title, color: colors.text },
  subtitle: { ...typography.body, color: colors.textMuted },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.m,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.m,
  },
  cardTitle: { ...typography.heading, color: colors.text, marginBottom: spacing.xs },
  cardBody: { ...typography.body, color: colors.textMuted },
});
