/**
 * Spacing and corner-radius tokens for the Peryskop DS.
 *
 * - **Radius** mirrors Figma 1:1 (8 / 12 / 16) plus `none` and `full` for
 *   universal edge cases (flat corners, pills/avatars).
 * - **Spacing** is a 4-based scale. Figma does not expose this as Variables
 *   today; the scale below is the convention we apply when composing
 *   components. Update both this file and the Figma side if the team agrees
 *   on a different rhythm.
 *
 * Both scales are consumed by Tamagui as `space` / `radius` tokens, so
 * components can reference them via `$xs`, `$sm`, `$md`, etc.
 */

/** Corner radius (px). */
export const radius = {
  none: 0,
  sm: 8,
  md: 12,
  lg: 16,
  full: 9999, // pill buttons, circular avatars
} as const

/** Spacing scale (px) — used for padding, margin, and gap. */
export const space = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const

export type RadiusToken = keyof typeof radius
export type SpaceToken = keyof typeof space
