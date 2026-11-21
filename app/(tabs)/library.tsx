import { useCallback, useState } from 'react';
import { StyleSheet, Text, View, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import { File, Paths } from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { useEngine, type MediaFile } from '@/lib/engine';
import { colors, radius, spacing, typography } from '@/lib/theme';
import { Button } from '@/components/Button';

const CHUNK = 5 * 1024 * 1024;

export default function LibraryScreen() {
  const { request } = useEngine();
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadFiles = useCallback(async () => {
    setRefreshing(true);
    try {
      const data = await request<MediaFile[]>('/files');
      setFiles(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load files');
    } finally {
      setRefreshing(false);
    }
  }, [request]);

  const pickAndUpload = async () => {
    setError(null);
    setStatus(null);
    const result = await DocumentPicker.getDocumentAsync({ type: 'video/*', copyToCacheDirectory: true });
    if (result.canceled || !result.assets?.length) return;
    const asset = result.assets[0];
    setBusy(true);
    try {
      const picked = new File(asset.uri);
      if (!picked.exists) {
        setError('Could not read the picked file');
        return;
      }
      const totalBytes = picked.size ?? 0;
      const data = await picked.base64();
      const chunks = splitBase64(data, CHUNK);
      let response: { fileId?: string; received?: number } | null = null;
      for (let i = 0; i < chunks.length; i++) {
        setStatus(`Uploading chunk ${i + 1} of ${chunks.length}…`);
        response = await request<{ fileId?: string; received?: number }>('/uploads', {
          method: 'POST',
          json: {
            fileName: asset.name,
            mime: asset.mimeType ?? 'video/mp4',
            totalBytes,
            chunkIndex: i,
            totalChunks: chunks.length,
            dataBase64: chunks[i],
          },
        });
      }
      setStatus(response?.fileId ? 'Upload complete and probed by the engine' : 'Upload complete');
      await loadFiles();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setBusy(false);
    }
  };

  const exportToGallery = async (file: MediaFile) => {
    setError(null);
    setStatus(null);
    try {
      const target = new File(Paths.cache, file.original_name);
      await File.downloadFileAsync(`http://127.0.0.1:8787/download/${file.id}`, target, { idempotent: true });
      const { granted } = await MediaLibrary.requestPermissionsAsync();
      if (!granted) {
        setError('Gallery permission denied');
        return;
      }
      await MediaLibrary.saveToLibraryAsync(target.uri);
      setStatus('Saved to gallery');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Export failed');
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <FlatList
        data={files}
        keyExtractor={(f) => f.id}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadFiles} tintColor={colors.textMuted} />}
        ListHeaderComponent={
          <View style={{ gap: spacing.m, marginBottom: spacing.m }}>
            <Text style={styles.title}>Library</Text>
            <Button label={busy ? 'Uploading…' : 'Pick a video'} onPress={pickAndUpload} disabled={busy} loading={busy} />
            {status && <Text style={styles.status}>{status}</Text>}
            {error && <Text style={styles.error}>{error}</Text>}
            {!files.length && <Text style={styles.hint}>Pull to refresh after the engine has files, or pick one above.</Text>}
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name} numberOfLines={1}>{item.original_name}</Text>
            <Text style={styles.meta}>{(item.size_bytes / 1024 / 1024).toFixed(1)} MB · {item.mime}</Text>
            <Button label="Save to gallery" variant="secondary" onPress={() => exportToGallery(item)} style={styles.btn} />
          </View>
        )}
      />
    </SafeAreaView>
  );
}

function splitBase64(data: string, chunkBytes: number): string[] {
  const chars = Math.floor((chunkBytes * 4) / 3);
  const out: string[] = [];
  for (let i = 0; i < data.length; i += chars) out.push(data.slice(i, i + chars));
  return out;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.m },
  title: { ...typography.title, color: colors.text },
  status: { ...typography.body, color: colors.accent },
  error: { ...typography.body, color: colors.error },
  hint: { ...typography.body, color: colors.textMuted },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.m,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.m,
    marginBottom: spacing.s,
    gap: spacing.xs,
  },
  name: { ...typography.heading, color: colors.text, fontSize: 16 },
  meta: { ...typography.label, color: colors.textMuted },
  btn: { marginTop: spacing.s },
});
