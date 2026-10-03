/**
 * AustinKnow Design System Tokens
 * Centralized Single-Source-of-Truth for Colors, Typography, and Gradients.
 * Use these tokens in TypeScript/React components or via CSS variables in globals.css.
 */

export const THEME_FONTS = {
  // Display & Heading Font: Modern, geometric, clean humanistic sans
  display: 'var(--font-display, "Plus Jakarta Sans", sans-serif)',
  // Body text font: highly legible at all sizes
  sans: 'var(--font-sans, "Inter", sans-serif)',
  // Monospace font: clean ligature-ready terminal code font
  mono: 'var(--font-mono, "JetBrains Mono", monospace)',
} as const;

export const THEME_COLORS = {
  // Pure background system designed for OLED & deep dark aesthetics
  background: {
    pureBlack: '#050505',
    darkElevated: '#0c0e14',
    darkSurface: '#121620',
    light: '#ffffff',
    lightElevated: '#f8fafc',
  },
  // High-contrast foreground text colors
  foreground: {
    primaryDark: '#ffffff',
    secondaryDark: '#94a3b8',
    mutedDark: '#64748b',
    primaryLight: '#0f172a',
    secondaryLight: '#475569',
    mutedLight: '#94a3b8',
  },
  // Brand accents & focal points
  brand: {
    electricBlue: '#3b82f6',
    royalIndigo: '#6366f1',
    neonCyan: '#06b6d4',
    tealEmerald: '#14b8a6',
    softPurple: '#a855f7',
    coralRose: '#f43f5e',
  },
  // Domain thematic color mappings (sync with 3D canvas and dynamic badges)
  domains: {
    medical: {
      primary: '#14b8a6', // Teal
      glow: '#2dd4bf',
      border: 'rgba(20, 184, 166, 0.3)',
      bg: 'rgba(20, 184, 166, 0.08)',
    },
    seo: {
      primary: '#8b5cf6', // Violet
      glow: '#c084fc',
      border: 'rgba(139, 92, 246, 0.3)',
      bg: 'rgba(139, 92, 246, 0.08)',
    },
    coding: {
      primary: '#3b82f6', // Electric Azure
      glow: '#60a5fa',
      border: 'rgba(59, 130, 246, 0.3)',
      bg: 'rgba(59, 130, 246, 0.08)',
    },
    design: {
      primary: '#f43f5e', // Rose Coral
      glow: '#fb7185',
      border: 'rgba(244, 63, 94, 0.3)',
      bg: 'rgba(244, 63, 94, 0.08)',
    },
  },
  // Curated premium button gradients crafted specifically for pure black
  gradients: {
    heroPrimary: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #06b6d4 100%)',
    heroAccent: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
    glassBorder: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.03) 100%)',
    glowCyan: 'radial-gradient(circle, rgba(6, 182, 212, 0.35) 0%, transparent 70%)',
  },
} as const;

export type ThemeColors = typeof THEME_COLORS;
export type ThemeFonts = typeof THEME_FONTS;
