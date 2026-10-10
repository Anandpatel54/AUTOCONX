export const colors = {
  // Luxury Automotive Brand Palette
  primary: '#091E36',          // Midnight Sapphire
  primaryDark: '#040E1B',      // Ultra deep obsidian
  primaryLight: '#112F53',     // Rich Slate Navy
  accent: '#0284C7',           // Precision Cerulean
  accentGlow: '#E0F2FE',       // Sky tint
  accentHover: '#0369A1',

  // Clean Light Surface Palette
  background: '#F8FAFC',       // Crisp neutral grey
  surface: '#FFFFFF',          // Pure card white
  surfaceMuted: '#F1F5F9',     // Subtle slate fill
  surfaceSelected: '#F0F9FF',  // Sky 50
  surfaceDark: '#091E36',      // Dark contrast card
  surfaceDarkElevated: '#112B4C',

  // Typography Tokens
  textPrimary: '#0F172A',      // Slate 900
  textSecondary: '#475569',    // Slate 600
  textMuted: '#94A3B8',        // Slate 400
  textInverse: '#FFFFFF',
  textInverseMuted: '#94A3B8',

  // Feedback & Semantic Tokens
  success: '#059669',          // Deep Emerald
  successBg: '#ECFDF5',
  successBorder: '#6EE7B7',

  warning: '#D97706',          // Warm Amber
  warningBg: '#FFFBEB',
  warningBorder: '#FCD34D',

  error: '#DC2626',            // Crimson Red
  errorBg: '#FEF2F2',
  errorBorder: '#FCA5A5',

  // Borders & Dividers
  border: '#E2E8F0',           // 1px clean hairline
  borderSubtle: '#F1F5F9',
  borderDark: '#CBD5E1',
  borderActive: '#0284C7',

  // License plate metallic tokens
  plateBorder: '#1E293B',
  plateBg: '#FFFFFF',
  plateCodeRed: '#DC2626',

  shadow: '#0F172A',
  backdrop: 'rgba(9, 30, 54, 0.45)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const shadows = {
  subtle: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  card: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  elevated: {
    shadowColor: '#091E36',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
};
