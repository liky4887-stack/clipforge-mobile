export const colors = {
  background: '#0C0F14',
  surface: '#151A23',
  surfaceLight: '#1E2530',
  border: '#2A3240',
  text: '#F2F5F9',
  textMuted: '#8A93A3',
  accent: '#4CC38A',
  accentDim: '#2E7D5B',
  warning: '#E5B454',
  error: '#E0564F',
  info: '#5B9DD9',
};

export const spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
} as const;

export const radius = { s: 8, m: 12, l: 20 };

export const typography = {
  title: { fontSize: 28, lineHeight: 34, fontWeight: '700' as const },
  heading: { fontSize: 20, lineHeight: 24, fontWeight: '600' as const },
  body: { fontSize: 15, lineHeight: 23, fontWeight: '400' as const },
  label: { fontSize: 13, lineHeight: 18, fontWeight: '500' as const },
};
