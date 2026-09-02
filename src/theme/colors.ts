// Hex equivalents of the oklch() tokens from the approved Claude Design mockup
// ("Aplikacja mobilna do ćwiczeń jogi" — Yoga App.dc.html). React Native does not
// render oklch() in StyleSheet, so each token was converted once (Björn Ottosson's
// OKLab formulas) and is kept here with its source value for traceability.
// Shared by the calendar's "done" marker and the picker's "selected" check — one green, two uses.
const sageGreen = '#5f9463';

export const colors = {
  background: '#fbf4eb', // oklch(0.97 0.014 75)
  surface: '#f4e5d7', // oklch(0.93 0.025 65)
  surfaceAlt: '#fefbf7', // oklch(0.99 0.006 75)
  border: '#ddc5b5', // oklch(0.84 0.035 55)

  textPrimary: '#38231c', // oklch(0.28 0.035 40)
  textSecondary: '#78645a', // oklch(0.52 0.03 48)
  textTertiary: '#8d7c73', // oklch(0.6 0.025 52)
  textMuted: '#91837b', // oklch(0.62 0.02 52)
  textFaint: '#aca29c', // oklch(0.72 0.015 58)

  accent: '#b95c3a', // oklch(0.58 0.13 40) — primary terracotta accent
  accentDashed: '#bd6e4f', // oklch(0.62 0.11 42) — dashed "add" borders
  accentOn: '#fefbf7', // oklch(0.99 0.006 75) — text/icons on accent fill

  danger: '#b54436', // oklch(0.54 0.15 30)

  ringTrack: '#e9d7c9', // oklch(0.89 0.028 60)
  ringInner: '#eddaca', // oklch(0.9 0.03 62)

  success: sageGreen, // confirmation marks drawn at full strength, e.g. the selected language
  calendarDoneBg: sageGreen, // "done" marker, used at partial opacity in the calendar
} as const;

export type ColorToken = keyof typeof colors;
