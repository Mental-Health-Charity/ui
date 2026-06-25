/**
 * Raw color palette — 1:1 mirror of Figma Variables (collection "Variable collection").
 *
 * Do not use these values directly in components — use semantic theme tokens
 * (e.g. `$background`, `$primary`, `$borderColor`). That way dark mode and re-branding
 * boil down to changing themes.ts.
 *
 * Shade hierarchy used in Peryskop DS:
 *   darkest → darker → dark → base → light → lighter → lightest
 */
export const palette = {
  green: {
    lighter: '#7dde86',
    lightest: '#ecfce5',
  },
  ink: {
    darkest: '#090a0a',
    darker: '#202325',
    dark: '#303437',
    base: '#404446',
    light: '#6c7072',
    lighter: '#72777a',
  },
  primary: {
    darkest: '#022e2a',
    darker: '#035c54',
    dark: '#05897d',
    base: '#06b7a7',
    light: '#44c9bd',
    lighter: '#83dbd3',
    lightest: '#c1ede9',
  },
  red: {
    // NOTE: Figma has `Red/Darkest` with value #d3180c but a var-alias of "Red/Dark" — inconsistency.
    // We treat `name` from the export (Darkest) as the source of truth.
    darkest: '#d3180c',
    base: '#ff5247',
    light: '#ff6d6d',
    lighter: '#ff9898',
    lightest: '#ffe5e5',
  },
  secondary: {
    darkest: '#403017',
    darker: '#80612e',
    dark: '#bf9145',
    base: '#ffc15c',
    light: '#ffd185',
    lighter: '#ffe0ae',
    lightest: '#fff0d6',
  },
  sky: {
    dark: '#979c9e',
    base: '#cdcfd0',
    light: '#e3e5e5',
    lighter: '#f2f4f5',
    lightest: '#f7f9fa',
  },
  // Utility constants — used in themes.ts for contrast text on brand colors.
  common: {
    white: '#ffffff',
    black: '#000000',
    transparent: 'rgba(0,0,0,0)',
  },
} as const

/**
 * Flattened palette as Tamagui tokens (`createTokens` requires flat key-value pairs).
 * Naming convention: camelCase, e.g. `primary.base` → `primaryBase`.
 */
export const colorTokens = {
  greenLighter: palette.green.lighter,
  greenLightest: palette.green.lightest,

  inkDarkest: palette.ink.darkest,
  inkDarker: palette.ink.darker,
  inkDark: palette.ink.dark,
  inkBase: palette.ink.base,
  inkLight: palette.ink.light,
  inkLighter: palette.ink.lighter,

  primaryDarkest: palette.primary.darkest,
  primaryDarker: palette.primary.darker,
  primaryDark: palette.primary.dark,
  primaryBase: palette.primary.base,
  primaryLight: palette.primary.light,
  primaryLighter: palette.primary.lighter,
  primaryLightest: palette.primary.lightest,

  redDarkest: palette.red.darkest,
  redBase: palette.red.base,
  redLight: palette.red.light,
  redLighter: palette.red.lighter,
  redLightest: palette.red.lightest,

  secondaryDarkest: palette.secondary.darkest,
  secondaryDarker: palette.secondary.darker,
  secondaryDark: palette.secondary.dark,
  secondaryBase: palette.secondary.base,
  secondaryLight: palette.secondary.light,
  secondaryLighter: palette.secondary.lighter,
  secondaryLightest: palette.secondary.lightest,

  skyDark: palette.sky.dark,
  skyBase: palette.sky.base,
  skyLight: palette.sky.light,
  skyLighter: palette.sky.lighter,
  skyLightest: palette.sky.lightest,

  white: palette.common.white,
  black: palette.common.black,
  transparent: palette.common.transparent,
} as const

export type ColorToken = keyof typeof colorTokens
