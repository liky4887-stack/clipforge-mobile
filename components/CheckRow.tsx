import { colors, radius, spacing } from '@/lib/theme';
import { StyleSheet, Text, View } from 'react-native';

const STATUS_COLORS = {
  ok: colors.accent,
  missing: colors.error,
  too_slow: colors.warning,
  manual_mode: colors.info,
} as const;

type Props = {
  name: string;
  status: keyof typeof STATUS_COLORS;
  detail: string;
};

const LABELS: Record<string, string> = {
  ok: 'OK',
  missing: 'Missing',
  too_slow: 'Too slow',
  manual_mode: 'Manual mode',
};

export function CheckRow({ name, status, detail }: Props) {
  const color = STATUS_COLORS[status];
  return (
    <View style={styles.row}>
      <View style={styles.topLine}>
        <Text style={styles.name}>{name}</Text>
        <View style={[styles.badge, { backgroundColor: `${color}22`, borderColor: color }]}>
          <Text style={[styles.badgeText, { color }]}>{LABELS[status]}</Text>
        </View>
      </View>
      <Text style={styles.detail}>{detail}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: colors.surface,
    borderRadius: radius.m,
    padding: spacing.m,
    marginBottom: spacing.s,
    borderWidth: 1,
    borderColor: colors.border,
  },
  topLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  name: { color: colors.text, fontWeight: '600', fontSize: 15 },
  badge: { borderRadius: 999, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 2 },
  badgeText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  detail: { color: colors.textMuted, fontSize: 13, lineHeight: 19 },
});
