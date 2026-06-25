import { palette } from './palette'

/**
 * Semantic theme tokens.
 *
 * Components MUST reference these tokens (e.g. `$background`, `$primary`)
 * rather than the raw palette. That way dark mode and re-branding only
 * require changing this file.
 *
 * Naming follows Tamagui conventions:
 *   - background / backgroundHover / backgroundPress / backgroundFocus
 *   - color / colorHover / colorPress
 *   - borderColor / borderColorHover
 *   - placeholderColor
 *   - brand: primary, secondary, danger, success
 */

const lightTheme = {
  // Surfaces
  background: palette.common.white,
  backgroundHover: palette.sky.lightest,
  backgroundPress: palette.sky.lighter,
  backgroundFocus: palette.sky.lighter,
  backgroundStrong: palette.sky.lighter, // e.g. selected item background
  backgroundTransparent: palette.common.transparent,

  // Content (text, icons)
  color: palette.ink.darkest,
  colorHover: palette.ink.darker,
  colorPress: palette.ink.darker,
  colorMuted: palette.ink.light,
  colorInverse: palette.common.white,
  placeholderColor: palette.ink.lighter,

  // Borders
  borderColor: palette.sky.base,
  borderColorHover: palette.sky.dark,
  borderColorFocus: palette.primary.base,
  borderColorPress: palette.sky.dark,

  // Brand — Primary (teal)
  primary: palette.primary.base,
  primaryHover: palette.primary.dark,
  primaryPress: palette.primary.darker,
  primarySoft: palette.primary.lightest,    // ghost / chip background
  primaryBorder: palette.primary.light,
  primaryText: palette.common.white,        // text on primary background
  primaryTextSoft: palette.primary.darkest, // text on primarySoft background

  // Brand — Secondary (yellow)
  secondary: palette.secondary.base,
  secondaryHover: palette.secondary.dark,
  secondaryPress: palette.secondary.darker,
  secondarySoft: palette.secondary.lightest,
  secondaryBorder: palette.secondary.light,
  secondaryText: palette.ink.darkest,          // yellow bg → dark text (contrast)
  secondaryTextSoft: palette.secondary.darkest,

  // States
  danger: palette.red.base,
  dangerHover: palette.red.darkest,
  dangerPress: palette.red.darkest,
  dangerSoft: palette.red.lightest,
  dangerText: palette.common.white,
  dangerTextSoft: palette.red.darkest,

  success: palette.green.lighter,
  successSoft: palette.green.lightest,
  successText: palette.ink.darkest,

  // Misc
  shadowColor: 'rgba(9, 10, 10, 0.08)',
  overlay: 'rgba(9, 10, 10, 0.45)', // modal/dialog backdrop
}

// Shared theme shape — derived from the light theme keys but widens the
// value type to `string` so the dark theme can hold different hex values.
type ThemeShape = Record<keyof typeof lightTheme, string>

/**
 * Dark theme — Peryskop palette has no official dark variant,
 * so this is a best-effort mapping (ink as surface, sky as text).
 * To be refined when the designer delivers dark-mode Variables.
 */
const darkTheme: ThemeShape = {
  background: palette.ink.darkest,
  backgroundHover: palette.ink.darker,
  backgroundPress: palette.ink.dark,
  backgroundFocus: palette.ink.darker,
  backgroundStrong: palette.ink.dark,
  backgroundTransparent: palette.common.transparent,

  color: palette.sky.lightest,
  colorHover: palette.sky.lighter,
  colorPress: palette.sky.light,
  colorMuted: palette.sky.dark,
  colorInverse: palette.ink.darkest,
  placeholderColor: palette.ink.lighter,

  borderColor: palette.ink.base,
  borderColorHover: palette.ink.light,
  borderColorFocus: palette.primary.light,
  borderColorPress: palette.ink.light,

  primary: palette.primary.light,
  primaryHover: palette.primary.base,
  primaryPress: palette.primary.lighter,
  primarySoft: palette.primary.darkest,
  primaryBorder: palette.primary.dark,
  primaryText: palette.ink.darkest,
  primaryTextSoft: palette.primary.lightest,

  secondary: palette.secondary.base,
  secondaryHover: palette.secondary.light,
  secondaryPress: palette.secondary.lighter,
  secondarySoft: palette.secondary.darkest,
  secondaryBorder: palette.secondary.dark,
  secondaryText: palette.ink.darkest,
  secondaryTextSoft: palette.secondary.lightest,

  danger: palette.red.base,
  dangerHover: palette.red.light,
  dangerPress: palette.red.lighter,
  dangerSoft: palette.red.darkest,
  dangerText: palette.common.white,
  dangerTextSoft: palette.red.lightest,

  success: palette.green.lighter,
  successSoft: palette.primary.darkest,
  successText: palette.green.lightest,

  shadowColor: 'rgba(0, 0, 0, 0.4)',
  overlay: 'rgba(0, 0, 0, 0.6)',
}

export const themes = {
  light: lightTheme,
  dark: darkTheme,
} as const

export type AppThemes = typeof themes
export type ThemeName = keyof AppThemes
export type ThemeTokens = keyof typeof lightTheme
