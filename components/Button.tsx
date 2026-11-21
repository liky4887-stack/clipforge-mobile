import { colors, radius, spacing, typography } from '@/lib/theme';
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';

const _spacing = spacing;
const _radius = radius;
const _typography = typography;
const _colors = colors;

void _spacing;
void _radius;
void _typography;
void _colors;

type Props = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
};

export function Button({ label, onPress, variant = 'primary', disabled, loading, style }: Props) {
  const bg = variant === 'primary' ? colors.accent : variant === 'danger' ? colors.error : colors.surfaceLight;
  const fg = variant === 'primary' ? '#0C0F14' : colors.text;
  return (
    <Pressable
      onPress={() => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        onPress();
      }}
      disabled={disabled || loading}
      style={({ pressed }) => [styles.base, { backgroundColor: bg, opacity: disabled ? 0.4 : pressed ? 0.8 : 1 }, style]}
    >
      {loading ? <ActivityIndicator color={fg} /> : <Text style={[styles.label, { color: fg }]}>{label}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.m,
    paddingVertical: 14,
    paddingHorizontal: spacing.l,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { ...typography.label, fontSize: 15 },
});
