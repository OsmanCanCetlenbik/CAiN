export const colors = {
  background: '#FFFFFF',
  backgroundSecondary: '#FAFBFC',
  surface: '#F8FAFC',
  surfaceElevated: '#FFFFFF',
  primary: '#6366F1',
  primaryDark: '#4F46E5',
  primaryLight: '#A5B4FC',
  secondary: '#8B5CF6',
  accent: '#06B6D4',
  text: '#0F172A',
  textSecondary: '#334155',
  textMuted: '#64748B',
  textLight: '#94A3B8',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  danger: '#EF4444',
  dangerLight: '#FEE2E2',
  error: '#EF4444',
  gradient: {
    primary: ['#6366F1', '#8B5CF6'],
    secondary: ['#06B6D4', '#3B82F6'],
    success: ['#10B981', '#059669'],
    sunset: ['#F97316', '#EF4444', '#EC4899'],
    ocean: ['#0EA5E9', '#3B82F6', '#6366F1'],
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  pill: 999,
};

export const typography = {
  h1: { fontSize: 32, fontWeight: '800' as const, color: colors.text, lineHeight: 40 },
  h2: { fontSize: 28, fontWeight: '700' as const, color: colors.text, lineHeight: 36 },
  h3: { fontSize: 24, fontWeight: '700' as const, color: colors.text, lineHeight: 32 },
  title: { fontSize: 20, fontWeight: '700' as const, color: colors.text, lineHeight: 28 },
  subtitle: { fontSize: 16, fontWeight: '500' as const, color: colors.textSecondary, lineHeight: 24 },
  body: { fontSize: 16, fontWeight: '400' as const, color: colors.text, lineHeight: 24 },
  bodyBold: { fontSize: 16, fontWeight: '600' as const, color: colors.text, lineHeight: 24 },
  bodySmall: { fontSize: 14, fontWeight: '400' as const, color: colors.textMuted, lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '400' as const, color: colors.textLight, lineHeight: 16 },
  button: { fontSize: 16, fontWeight: '600' as const, color: '#FFFFFF', lineHeight: 24 },
  buttonSmall: { fontSize: 14, fontWeight: '600' as const, color: '#FFFFFF', lineHeight: 20 },
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
};

export const theme = { colors, spacing, radius, typography, shadows };

export type Theme = typeof theme;



