export const colors = {
  background: '#F7F5F1',
  surface: '#FFFFFF',
  surfaceAlt: '#F1EDE6',
  primary: '#1F6F4A',
  primaryDark: '#144F34',
  primaryLight: '#E4F1EA',
  accent: '#D97B3F',
  accentLight: '#FBE9DA',
  gold: '#C9A24B',
  textPrimary: '#20241F',
  textSecondary: '#5B6259',
  textMuted: '#8B9188',
  border: '#E5E1D8',
  danger: '#C2483B',
  white: '#FFFFFF',
  overlay: 'rgba(20, 24, 20, 0.55)',
};

export const categoryColors: Record<string, { bg: string; fg: string }> = {
  Kitchen: { bg: '#FDEBD8', fg: '#B45A1E' },
  Bathroom: { bg: '#DCEEF5', fg: '#1F6E8C' },
  'Curb Appeal': { bg: '#E5F1DE', fg: '#3E7A34' },
  'Energy Efficiency': { bg: '#FFF3C9', fg: '#957410' },
  Outdoor: { bg: '#E1F0EA', fg: '#1F6F4A' },
  'Interior Paint': { bg: '#F1E3F0', fg: '#8B3E86' },
  Storage: { bg: '#E7E7F5', fg: '#4C4E9A' },
  Flooring: { bg: '#EFE6D8', fg: '#8A6A2E' },
};

export const difficultyColors: Record<string, { bg: string; fg: string }> = {
  Easy: { bg: '#E4F1E4', fg: '#2E7D32' },
  Medium: { bg: '#FFF1D6', fg: '#B8860B' },
  Hard: { bg: '#FBE1DE', fg: '#C2483B' },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radii = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
};

export const typography = {
  h1: { fontSize: 28, fontWeight: '800' as const, letterSpacing: -0.3 },
  h2: { fontSize: 22, fontWeight: '700' as const, letterSpacing: -0.2 },
  h3: { fontSize: 18, fontWeight: '700' as const },
  body: { fontSize: 15, fontWeight: '400' as const },
  bodyBold: { fontSize: 15, fontWeight: '600' as const },
  caption: { fontSize: 13, fontWeight: '500' as const },
  small: { fontSize: 11, fontWeight: '600' as const },
};

export const shadow = {
  card: {
    shadowColor: '#1A1F1A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
};
