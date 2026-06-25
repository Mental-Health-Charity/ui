import { createFont } from 'tamagui'

/**
 * Typography — mirror of Figma Font Variables (Sarabun).
 *
 * NOTE: in Figma the token named "semibold" actually uses weight `Medium` (500),
 * not SemiBold (600). We follow Figma's actual weight — `semibold` = `500`.
 *
 * The font family must be loaded by the consuming app:
 *   - web: <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@400;500;700">
 *   - native (Expo): expo-font + Sarabun-Regular/Medium/Bold.ttf
 */

export const fontFamily = 'Sarabun'

/** Sarabun weights used in the design. */
export const fontWeight = {
  regular: '400',
  semibold: '500', // Figma "Medium"
  bold: '700',
} as const

/** Sizes (px) — names mirror Figma. */
export const fontSize = {
  tiny: 12,
  small: 14,
  regular: 16,
  large: 18,
  title3: 24,
  title2: 32,
  title1: 48,
} as const

/** Line height (px) paired with each size. */
export const lineHeight = {
  tiny: 16,
  small: 20,
  regular: 21,
  large: 23,
  title3: 32,
  title2: 36,
  title1: 56,
} as const

/**
 * Tamagui font — numeric keys (Tamagui uses a 1..N scale).
 * Index mapping:
 *   1 = tiny (12), 2 = small (14), 3 = regular (16), 4 = large (18),
 *   5 = title3 (24), 6 = title2 (32), 7 = title1 (48)
 */
export const sarabunFont = createFont({
  family: fontFamily,
  size: {
    1: fontSize.tiny,
    2: fontSize.small,
    3: fontSize.regular,
    4: fontSize.large,
    5: fontSize.title3,
    6: fontSize.title2,
    7: fontSize.title1,
    true: fontSize.regular,
  },
  lineHeight: {
    1: lineHeight.tiny,
    2: lineHeight.small,
    3: lineHeight.regular,
    4: lineHeight.large,
    5: lineHeight.title3,
    6: lineHeight.title2,
    7: lineHeight.title1,
  },
  weight: {
    1: fontWeight.regular,
    2: fontWeight.semibold,
    3: fontWeight.bold,
  },
  letterSpacing: {
    1: 0,
  },
})
