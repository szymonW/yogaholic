// Spacing / radius / typography scale distilled from the mockup's inline styles.
export const spacing = {
  xxs: 4,
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 40,
} as const;

export const radius = {
  xs: 8,
  sm: 10,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 28,
  full: 9999,
} as const;

export const typography = {
  display: { fontSize: 34, fontWeight: '700' as const }, // Home title
  h1: { fontSize: 30, fontWeight: '700' as const }, // Kalendarz/Cele/Ustawienia/List title
  h2: { fontSize: 28, fontWeight: '700' as const }, // Detail/Create title
  h3: { fontSize: 26, fontWeight: '700' as const }, // Complete title
  bodyLg: { fontSize: 17, fontWeight: '600' as const },
  body: { fontSize: 16, fontWeight: '400' as const },
  label: { fontSize: 15, fontWeight: '600' as const },
  caption: { fontSize: 13, fontWeight: '400' as const },
  micro: { fontSize: 12, fontWeight: '400' as const },
} as const;
