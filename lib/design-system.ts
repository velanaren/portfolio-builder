/**
 * Portfolio Builder Design System
 * Bold, Gen Z-friendly, distinctive aesthetic
 * Dark academia meets tech forward
 */

export const colors = {
  // Background Colors
  bgPrimary: '#0A0E27',
  bgSecondary: '#1A1F35',
  bgTertiary: '#151B2F',
  bgElevated: '#1F2738',

  // Brand Colors
  brand: '#00D9FF',
  brandDark: '#00A8CC',
  brandLight: '#33E5FF',
  brandGlow: 'rgba(0, 217, 255, 0.15)',

  // Accent Colors
  accent: '#FF006E',
  accentSecondary: '#8338EC',
  accentGlow: 'rgba(255, 0, 110, 0.15)',

  // Text Colors
  textPrimary: '#F8F9FA',
  textSecondary: '#A0AEC0',
  textTertiary: '#718096',
  textMuted: '#4A5568',

  // Semantic Colors
  success: '#10B981',
  successDark: '#059669',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Border Colors
  border: '#2D3548',
  borderSubtle: '#1F2738',
  borderBright: 'rgba(0, 217, 255, 0.3)',
};

export const typography = {
  // Font Families
  fontDisplay: "'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif",
  fontBody: "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif",
  fontAccent: "'Playfair Display', Georgia, serif",
  fontMono: "'JetBrains Mono', 'Courier New', monospace",

  // Heading Styles
  headingXL: {
    fontSize: '64px',
    fontWeight: '800',
    lineHeight: '1.2',
    letterSpacing: '-0.5px',
    color: colors.textPrimary,
    fontFamily: "'Space Grotesk', sans-serif",
  },
  headingL: {
    fontSize: '48px',
    fontWeight: '700',
    lineHeight: '1.2',
    letterSpacing: '-0.5px',
    color: colors.textPrimary,
    fontFamily: "'Space Grotesk', sans-serif",
  },
  headingM: {
    fontSize: '36px',
    fontWeight: '700',
    lineHeight: '1.2',
    letterSpacing: '-0.5px',
    color: colors.textPrimary,
    fontFamily: "'Space Grotesk', sans-serif",
  },
  headingS: {
    fontSize: '24px',
    fontWeight: '600',
    lineHeight: '1.3',
    letterSpacing: '-0.5px',
    color: colors.textPrimary,
    fontFamily: "'Space Grotesk', sans-serif",
  },
  headingXS: {
    fontSize: '20px',
    fontWeight: '600',
    lineHeight: '1.4',
    letterSpacing: '-0.5px',
    color: colors.textPrimary,
    fontFamily: "'Space Grotesk', sans-serif",
  },

  // Body Text Styles
  bodyL: {
    fontSize: '16px',
    fontWeight: '400',
    lineHeight: '1.6',
    color: colors.textSecondary,
    fontFamily: "'IBM Plex Sans', sans-serif",
  },
  bodyM: {
    fontSize: '14px',
    fontWeight: '400',
    lineHeight: '1.6',
    color: colors.textSecondary,
    fontFamily: "'IBM Plex Sans', sans-serif",
  },
  bodyS: {
    fontSize: '12px',
    fontWeight: '400',
    lineHeight: '1.5',
    color: colors.textTertiary,
    fontFamily: "'IBM Plex Sans', sans-serif",
  },

  // Special Text Styles
  label: {
    fontSize: '14px',
    fontWeight: '600',
    lineHeight: '1.4',
    color: colors.textPrimary,
    fontFamily: "'Space Grotesk', sans-serif",
  },
  caption: {
    fontSize: '12px',
    fontWeight: '500',
    lineHeight: '1.4',
    color: colors.textTertiary,
    fontFamily: "'IBM Plex Sans', sans-serif",
  },
  code: {
    fontSize: '13px',
    fontWeight: '400',
    lineHeight: '1.5',
    color: colors.brandLight,
    fontFamily: "'JetBrains Mono', monospace",
  },
};

export const spacing = {
  // Spacing Scale (in px)
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '32px',
  '4xl': '40px',
  '5xl': '48px',
  '6xl': '64px',
  '7xl': '80px',
  '8xl': '96px',

  // Semantic Spacing
  section: '64px',
  large: '48px',
  medium: '32px',
  regular: '24px',
  small: '16px',
  tiny: '8px',
};

export const shadows = {
  // Shadow Levels
  sm: '0 2px 8px rgba(0, 0, 0, 0.2)',
  md: '0 8px 24px rgba(0, 0, 0, 0.3)',
  lg: '0 20px 40px rgba(0, 0, 0, 0.4)',
  xl: '0 30px 60px rgba(0, 0, 0, 0.5)',

  // Branded Shadows
  brand: '0 10px 30px rgba(0, 217, 255, 0.15)',
  brandHover: '0 15px 40px rgba(0, 217, 255, 0.25)',
  accent: '0 10px 30px rgba(255, 0, 110, 0.15)',

  // Glow Effects
  glowBrand: '0 0 20px rgba(0, 217, 255, 0.2), 0 0 40px rgba(0, 217, 255, 0.1)',
  glowAccent: '0 0 20px rgba(255, 0, 110, 0.2), 0 0 40px rgba(255, 0, 110, 0.1)',

  // Inner Shadow
  inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)',
};

export const transitions = {
  // Timing Functions
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  base: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: '400ms cubic-bezier(0.34, 1.56, 0.64, 1)',

  // Common Transitions
  default: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
  transform: 'transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
  color: 'color 150ms cubic-bezier(0.4, 0, 0.2, 1)',
  opacity: 'opacity 200ms cubic-bezier(0.4, 0, 0.2, 1)',
};

export const borderRadius = {
  sm: '6px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '20px',
  full: '9999px',
};

export const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  overlay: 40,
  modal: 50,
  popover: 60,
  toast: 70,
  tooltip: 80,
};

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Animation Presets
export const animations = {
  fadeIn: {
    keyframes: {
      from: { opacity: 0 },
      to: { opacity: 1 },
    },
    duration: '400ms',
    easing: 'ease-out',
  },
  slideUp: {
    keyframes: {
      from: { opacity: 0, transform: 'translateY(30px)' },
      to: { opacity: 1, transform: 'translateY(0)' },
    },
    duration: '500ms',
    easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  scaleIn: {
    keyframes: {
      from: { opacity: 0, transform: 'scale(0.9)' },
      to: { opacity: 1, transform: 'scale(1)' },
    },
    duration: '400ms',
    easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  bounceIn: {
    keyframes: {
      '0%': { opacity: 0, transform: 'scale(0.3)' },
      '50%': { opacity: 1, transform: 'scale(1.05)' },
      '70%': { transform: 'scale(0.9)' },
      '100%': { transform: 'scale(1)' },
    },
    duration: '600ms',
    easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
};

// Glassmorphism Presets
export const glassmorphism = {
  default: {
    background: 'rgba(26, 31, 53, 0.7)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(0, 217, 255, 0.1)',
  },
  light: {
    background: 'rgba(26, 31, 53, 0.5)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(0, 217, 255, 0.05)',
  },
  strong: {
    background: 'rgba(26, 31, 53, 0.9)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(0, 217, 255, 0.2)',
  },
};

// Component-specific presets
export const components = {
  button: {
    height: {
      sm: '32px',
      md: '40px',
      lg: '48px',
    },
    padding: {
      sm: '0 12px',
      md: '0 24px',
      lg: '0 32px',
    },
  },
  input: {
    height: {
      sm: '36px',
      md: '40px',
      lg: '48px',
    },
  },
  card: {
    padding: {
      sm: '16px',
      md: '24px',
      lg: '32px',
    },
  },
};

export default {
  colors,
  typography,
  spacing,
  shadows,
  transitions,
  borderRadius,
  zIndex,
  breakpoints,
  animations,
  glassmorphism,
  components,
};
