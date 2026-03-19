import type { CSSProperties } from 'react';

/**
 * Obsidian + teal — dark theme (no purple). Use these for inline styles.
 */
export const theme = {
  app: '#050708',
  surface: '#0a0d0d',
  surface2: '#0f1314',
  surface3: '#121a1b',
  surface4: '#141d1f',
  border: '#1f2e2d',
  borderMuted: 'rgba(31,46,46,0.5)',
  accent: '#0d9488',
  accentHover: '#14b8a6',
  accentSoft: '#2dd4bf',
  accentMuted: '#5eead4',
  accentGlow: 'rgba(13,148,136,0.15)',
  accentGlowSoft: 'rgba(13,148,136,0.08)',
  accentBorder: 'rgba(13,148,136,0.28)',
  text: '#f0fdfa',
  textSecondary: '#99f6e4',
  textMuted: '#6b9e97',
  textDim: '#5a7d78',
  pulse: '#34d399',
  chartGrid: 'rgba(31,46,46,0.85)',
  shadow: '0 20px 60px rgba(0,0,0,0.55)',
} as const;

export const cardStyle: CSSProperties = {
  background: theme.surface2,
  border: `1px solid ${theme.border}`,
  borderRadius: '12px',
};

export const cardHeaderBorder: CSSProperties = {
  borderBottom: `1px solid ${theme.border}`,
};
