import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useEngine } from '@/lib/engine';
import { colors } from '@/lib/theme';

export default function RootLayout() {
  useFrameworkReady();
  const loadTokens = useEngine((s) => s.loadTokens);

  useEffect(() => {
    void loadTokens();
  }, [loadTokens]);

  return (
    <>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}
