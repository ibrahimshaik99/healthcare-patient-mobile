export const Colors = {
  primary: '#2563EB',
  primaryDark: '#1D4ED8',
  primaryLight: '#3B82F6',
  primaryBg: '#EFF6FF',
  secondary: '#0D9488',
  secondaryLight: '#14B8A6',
  secondaryBg: '#F0FDFA',
  accent: '#F59E0B',
  accentLight: '#FBBF24',

  white: '#FFFFFF',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  divider: '#E2E8F0',

  text: '#0F172A',
  textSecondary: '#475569',
  textTertiary: '#94A3B8',
  textInverse: '#FFFFFF',
  textLink: '#2563EB',

  success: '#10B981',
  successBg: '#F0FDF4',
  warning: '#F59E0B',
  warningBg: '#FFFBEB',
  error: '#EF4444',
  errorBg: '#FEF2F2',
  info: '#3B82F6',
  infoBg: '#EFF6FF',

  statusPending: '#F59E0B',
  statusConfirmed: '#10B981',
  statusCancelled: '#EF4444',
  statusCompleted: '#3B82F6',
  statusMissed: '#6B7280',

  shadow: '#000000',
  overlay: 'rgba(0, 0, 0, 0.5)',
  transparent: 'transparent',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  xxxxl: 40,
};

export const Typography = {
  h1: {fontSize: 28, fontWeight: '700' as const, lineHeight: 36, letterSpacing: -0.5},
  h2: {fontSize: 24, fontWeight: '700' as const, lineHeight: 32, letterSpacing: -0.3},
  h3: {fontSize: 20, fontWeight: '600' as const, lineHeight: 28},
  h4: {fontSize: 18, fontWeight: '600' as const, lineHeight: 24},
  body: {fontSize: 16, fontWeight: '400' as const, lineHeight: 24},
  bodyMedium: {fontSize: 16, fontWeight: '500' as const, lineHeight: 24},
  bodySmall: {fontSize: 14, fontWeight: '400' as const, lineHeight: 20},
  caption: {fontSize: 12, fontWeight: '400' as const, lineHeight: 16},
  button: {fontSize: 16, fontWeight: '600' as const, lineHeight: 24},
  buttonSmall: {fontSize: 14, fontWeight: '600' as const, lineHeight: 20},
  label: {fontSize: 12, fontWeight: '500' as const, lineHeight: 16, textTransform: 'uppercase' as const},
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 999,
};

export const Shadows = {
  sm: {
    shadowColor: Colors.shadow,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: Colors.shadow,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: Colors.shadow,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  xl: {
    shadowColor: Colors.shadow,
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};
