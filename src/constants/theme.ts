import type { TextStyle } from 'react-native';

export const colors = {
  primary: '#1E6FD9',
  primaryDark: '#1557AD',
  onPrimary: '#FFFFFF',
  background: '#F5F7FA',
  surface: '#FFFFFF',
  border: '#D5DBE3',
  divider: '#E6EAF0',
  textPrimary: '#1B2430',
  textSecondary: '#5B6776',
  textMuted: '#8A95A3',
  error: '#D93025',
  success: '#1E8E3E',
  warning: '#E37400',
  overlay: 'rgba(0, 0, 0, 0.4)',
  seatAvailable: '#FFFFFF',
  seatAvailableBorder: '#9AA5B1',
  seatOccupied: '#C3CAD3',
  seatOccupiedBorder: '#C3CAD3',
  seatSelected: '#1E8E3E',
  seatSelectedBorder: '#1E8E3E',
  statusConfirmed: '#1E8E3E',
  statusExpired: '#8A95A3',
  tabActive: '#1E6FD9',
  tabInactive: '#8A95A3',
} as const;

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  pill: 999,
} as const;

export const borderWidth = {
  hairline: 1,
  thick: 2,
} as const;

export const typography = {
  title: { fontSize: 22, fontWeight: '700' },
  subtitle: { fontSize: 18, fontWeight: '600' },
  body: { fontSize: 16, fontWeight: '400' },
  bodyBold: { fontSize: 16, fontWeight: '600' },
  caption: { fontSize: 13, fontWeight: '400' },
  label: { fontSize: 14, fontWeight: '600' },
  mono: { fontSize: 14, fontWeight: '500', fontVariant: ['tabular-nums'] },
} satisfies Record<string, TextStyle>;

export const sizes = {
  seatCell: 40,
  seatGap: 8,
  aisleWidth: 24,
  rowLabelWidth: 28,
  iconSm: 16,
  iconMd: 24,
  iconLg: 32,
  buttonHeight: 48,
  inputHeight: 48,
  stepperButton: 40,
  radioOuter: 20,
  radioInner: 10,
  legendSwatch: 20,
} as const;

export const opacity = {
  disabled: 0.5,
  pressed: 0.7,
} as const;

export const hitSlop = {
  top: 8,
  bottom: 8,
  left: 8,
  right: 8,
} as const;
