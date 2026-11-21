import { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEngine, type Check } from '@/lib/engine';
import { colors, radius, spacing, typography } from '@/lib/theme';
import { Button } from '@/components/Button';
import { CheckRow } from '@/components/CheckRow';

export default function DeviceCheckScreen() {
  const { request, loadTokens } = useEngine();
  const [checks, setChecks] = useState<Check[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await request<{ checks: Check[] }>('/capabilities');
      setChecks(data.checks);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Engine check failed');
    } finally {
      setLoading(false);
    }
  }, [request]);

  useEffect(() => {
    void loadTokens().then(load);
  }, [load, loadTokens]);

  const offline = useEngine((s) => s.offline);
  const offlineReason = useEngine((s) => s.offlineReason);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor={colors.textMuted} />}>
        <Text style={styles.title}>Device check</Text>
        <Text style={styles.subtitle}>
          Everything below is measured on this phone by the engine in Termux. Features stay off until their check passes.
        </Text>

        {offline && (
          <View style={styles.offlineBox}>
            <Text style={styles.offlineText}>{offlineReason ?? 'Engine offline: open Termux and run npm start'}</Text>
          </View>
        )}

        {error && !offline && (
          <View style={[styles.offlineBox, { borderColor: colors.error }]}>
            <Text style={styles.offlineText}>{error}</Text>
          </View>
        )}

        {checks === null && !offline && !error && (
          <Text style={styles.hint}>Pull to refresh once the engine is running in Termux.</Text>
        )}

        {checks?.map((c) => <CheckRow key={c.name} {...c} />)}

        <View style={{ marginTop: spacing.m }}>
          <Button label={loading ? 'Checking…' : 'Run check'} onPress={load} loading={loading} />
        </View>

        <Text style={styles.footer}>
          Loopback only: the engine listens on 127.0.0.1 and talks only to this app on this phone.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.m, gap: spacing.m },
  title: { ...typography.title, color: colors.text },
  subtitle: { ...typography.body, color: colors.textMuted },
  offlineBox: {
    borderWidth: 1,
    borderColor: colors.warning,
    backgroundColor: colors.surface,
    borderRadius: radius.m,
    padding: spacing.m,
  },
  offlineText: { ...typography.body, color: colors.warning },
  hint: { ...typography.body, color: colors.textMuted },
  footer: { ...typography.label, color: colors.textMuted, textAlign: 'center', paddingBottom: spacing.l },
});
