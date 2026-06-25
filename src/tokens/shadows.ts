import { Platform } from 'react-native'

/**
 * Shadows from Figma.
 *
 * Source spec (X / Y / blur / spread / color + opacity):
 *   small:  0 / 0 / 8  / 0 / #141414 @ 8%
 *   medium: 0 / 1 / 8  / 2 / #141414 @ 8%
 *   large:  0 / 1 / 24 / 8 / #141414 @ 8%
 *
 * Cross-platform handling:
 *   - WEB: real CSS `boxShadow` (full `spread` support)
 *   - NATIVE: React Native has no `spread`. We approximate by extending
 *     `shadowRadius` by half of spread, and scale `elevation` (Android)
 *     proportionally to blur + spread.
 *
 * Apply as spread props:
 *   <View {...shadows.medium}>
 */

const SHADOW_HEX = '#141414'
const SHADOW_OPACITY = 0.08
const SHADOW_RGBA = `rgba(20, 20, 20, ${SHADOW_OPACITY})`

type ShadowSpec = {
  x: number
  y: number
  blur: number
  spread: number
}

function buildShadow({ x, y, blur, spread }: ShadowSpec) {
  return Platform.select({
    web: {
      boxShadow: `${x}px ${y}px ${blur}px ${spread}px ${SHADOW_RGBA}`,
    },
    default: {
      shadowColor: SHADOW_HEX,
      shadowOffset: { width: x, height: y },
      shadowOpacity: SHADOW_OPACITY,
      // Approximate the missing `spread` on native by extending blur.
      shadowRadius: blur + spread / 2,
      // Android: elevation is unitless; heuristic mapping.
      elevation: Math.max(1, Math.round((blur + spread) / 2)),
    },
  }) as object
}

export const shadows = {
  small: buildShadow({ x: 0, y: 0, blur: 8, spread: 0 }),
  medium: buildShadow({ x: 0, y: 1, blur: 8, spread: 2 }),
  large: buildShadow({ x: 0, y: 1, blur: 24, spread: 8 }),
} as const

export type ShadowSize = keyof typeof shadows
