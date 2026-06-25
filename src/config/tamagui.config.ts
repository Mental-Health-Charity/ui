import { createTamagui, createTokens } from 'tamagui'
import { defaultConfig } from '@tamagui/config/v4'
import { colorTokens } from '../tokens/palette'
import { themes } from '../tokens/themes'
import { sarabunFont } from '../tokens/typography'
import { radius, space } from '../tokens/spacing'

/**
 * Tamagui config for Peryskop DS.
 *
 * - **color tokens** + **themes** → from Figma Variables (src/tokens)
 * - **radius / space** → from Peryskop scale (src/tokens/spacing)
 * - **size / zIndex / animations / fonts (heading default)** → defaultConfig v4 for now,
 *   to be replaced when we receive these scales from Figma.
 *
 * NOTE: `@tamagui/config/v4` defaults to `onlyAllowShorthands: true` which
 * removes longhand style props (padding, backgroundColor, alignItems, ...)
 * from the TS surface. We turn it OFF so both `padding` and `p` work — the
 * runtime accepts both either way; this just relaxes the types so any
 * CSS-style prop is permitted.
 */

const tokens = createTokens({
  ...defaultConfig.tokens,
  // New namespace — exposes Peryskop palette as Tamagui tokens (e.g. `bg="$primaryBase"`).
  // Note: components should still prefer semantic theme tokens like `$primary` so dark
  // mode and re-branding stay swap-friendly. Raw palette is for one-off needs only.
  color: colorTokens,
  space: {
    ...defaultConfig.tokens.space,
    ...space,
  },
  radius: {
    ...defaultConfig.tokens.radius,
    ...radius,
  },
})

export const tamaguiConfig = createTamagui({
  ...defaultConfig,
  settings: {
    ...defaultConfig.settings,
    onlyAllowShorthands: false,
  },
  tokens,
  themes,
  fonts: {
    ...defaultConfig.fonts,
    body: sarabunFont,
    heading: sarabunFont,
  },
  defaultTheme: 'light',
})

export type AppConfig = typeof tamaguiConfig

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default tamaguiConfig
