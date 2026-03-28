export const Colors = {
  // Brand
  saffron: '#E8581A',
  saffronLight: '#F4814D',
  saffronDark: '#C44010',
  saffronMuted: '#FDF0EA',

  // Accents
  trustBlue: '#1A6BE8',
  trustBlueLight: '#4D8FF0',
  trustBlueMuted: '#EAF0FD',
  successGreen: '#18A86A',
  successGreenLight: '#2DC97E',
  successGreenMuted: '#E8F8F1',
  warningAmber: '#F59E0B',
  errorRed: '#EF4444',

  // Backgrounds - Light
  bgLight: '#F8F6F1',
  surfaceLight: '#FFFFFF',
  surfaceLight2: '#F2EFE8',
  borderLight: '#E8E4DC',
  dividerLight: '#F0EDE6',

  // Backgrounds - Dark
  bgDark: '#141210',
  surfaceDark: '#1E1C18',
  surfaceDark2: '#252320',
  borderDark: '#2E2C28',
  dividerDark: '#242220',

  // Text - Light
  textPrimaryLight: '#1A1512',
  textSecondaryLight: '#6B6560',
  textTertiaryLight: '#A09890',
  textDisabledLight: '#C8C4BC',

  // Text - Dark
  textPrimaryDark: '#F0EDE8',
  textSecondaryDark: '#9E9890',
  textTertiaryDark: '#6B6560',
  textDisabledDark: '#3E3C38',

  // Urgency
  urgencyHigh: '#EF4444',
  urgencyMedium: '#F59E0B',
  urgencyLow: '#18A86A',

  // Status
  statusOpen: '#1A6BE8',
  statusAssigned: '#F59E0B',
  statusInProgress: '#E8581A',
  statusResolved: '#18A86A',
  statusClosed: '#9E9890',

  // Transparent overlays
  overlay: 'rgba(0,0,0,0.5)',
  overlayLight: 'rgba(0,0,0,0.15)',
  saffronOverlay: 'rgba(232,88,26,0.12)',
  blueOverlay: 'rgba(26,107,232,0.1)',
  greenOverlay: 'rgba(24,168,106,0.1)',
};

export const DarkColors = {
  ...Colors,
  bg: Colors.bgDark,
  surface: Colors.surfaceDark,
  surface2: Colors.surfaceDark2,
  border: Colors.borderDark,
  divider: Colors.dividerDark,
  textPrimary: Colors.textPrimaryDark,
  textSecondary: Colors.textSecondaryDark,
  textTertiary: Colors.textTertiaryDark,
};

export const LightColors = {
  ...Colors,
  bg: Colors.bgLight,
  surface: Colors.surfaceLight,
  surface2: Colors.surfaceLight2,
  border: Colors.borderLight,
  divider: Colors.dividerLight,
  textPrimary: Colors.textPrimaryLight,
  textSecondary: Colors.textSecondaryLight,
  textTertiary: Colors.textTertiaryLight,
};
