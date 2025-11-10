/**
 * Premium Design System
 * Inspired by CRED.club - Modern, sophisticated, elegant
 */

export const colors = {
  // Primary Colors
  primaryDark: '#0F1419',
  primary: '#1A1F2E',

  // Accent Colors
  accentGold: '#D4A574',
  accentGoldDark: '#C89850',
  accentIndigo: '#6366F1',

  // Text Colors
  textDark: '#0F1419',
  textMedium: '#6B7280',
  textLight: '#9CA3AF',

  // Background Colors
  bgLight: '#FFFFFF',
  bgGray: '#F8FAFB',
  bgWarmWhite: '#FFFBF7',

  // Border Colors
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
};

export const typography = {
  headingXL: {
    fontSize: '48px',
    fontWeight: '700',
    letterSpacing: '-0.5px',
    color: colors.textDark,
  },
  headingL: {
    fontSize: '36px',
    fontWeight: '700',
    letterSpacing: '-0.5px',
    color: colors.textDark,
  },
  headingM: {
    fontSize: '28px',
    fontWeight: '600',
    letterSpacing: '-0.5px',
    color: colors.textDark,
  },
  headingS: {
    fontSize: '20px',
    fontWeight: '600',
    letterSpacing: '-0.5px',
    color: colors.textDark,
  },
  bodyL: {
    fontSize: '16px',
    fontWeight: '500',
  },
  bodyM: {
    fontSize: '14px',
    fontWeight: '400',
  },
  bodyS: {
    fontSize: '12px',
    fontWeight: '400',
  },
};

export const spacing = {
  section: '48px',
  large: '40px',
  medium: '32px',
  regular: '24px',
  small: '16px',
  tiny: '12px',
};

export const shadows = {
  subtle: '0 2px 8px rgba(0, 0, 0, 0.04)',
  medium: '0 8px 24px rgba(0, 0, 0, 0.08)',
  large: '0 12px 32px rgba(0, 0, 0, 0.08)',
};

export const transitions = {
  default: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
  fast: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
};
