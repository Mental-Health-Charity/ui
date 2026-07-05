import { Stack, styled, Text } from 'tamagui'

/**
 * Button styles — pure visual config, no behavior.
 *
 * Two layers:
 *   1. `ButtonFrame` / `ButtonText` — base styled() components shared by
 *      every variant (Figma constants: 12px radius, 12px padding x, etc.).
 *   2. `resolveButtonAppearance(...)` — pure function that picks the color
 *      set for a given (variant, outlined, disabled) combination.
 *
 * The component itself (Button.tsx) only orchestrates props and a11y;
 * all token references live in the tables below.
 */

// ---------------------------------------------------------------------------
// Base styled() — geometry, typography, a11y affordances
// ---------------------------------------------------------------------------

export const ButtonFrame = styled(Stack, {
  name: 'ButtonFrame',
  tag: 'button',
  role: 'button',
  cursor: 'pointer',

  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,

  paddingHorizontal: 12,
  paddingVertical: 8,
  // Guarantees vertical rhythm with Input (which is also 40px tall).
  // Uses `minHeight` — content can still push it larger (e.g. multi-line label),
  // but it will never collapse below the input baseline.
  minHeight: 40,
  borderRadius: 12,
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: 'transparent',

  userSelect: 'none',

  // Enable smooth transitions between rest / hover / press states.
  // Using a transform on press keeps the hitbox stable (transforms don't
  // affect layout, so pointer geometry stays the same).

  // Keyboard-only focus ring — visible for tab navigation, hidden on click.
  focusVisibleStyle: {
    outlineColor: '$borderColorFocus',
    outlineWidth: 2,
    outlineStyle: 'solid',
    outlineOffset: 2,
  },
})

export const ButtonText = styled(Text, {
  name: 'ButtonText',
  fontFamily: '$body',
  fontSize: 16,
  lineHeight: 21,
  fontWeight: '500', // Sarabun Medium — "regular/semibold" per Figma naming
  textAlign: 'center',
})

// ---------------------------------------------------------------------------
// Variant config — token references only, no styled() here
// ---------------------------------------------------------------------------

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'mutedPrimary'

// `as const` preserves the literal token strings (`'$primary'`, …) so they
// satisfy Tamagui's narrow `GetThemeValueForKey<...>` prop types when spread
// onto styled components.

const filledTable = {
  primary: {
    backgroundColor: '$primary',
    borderColor: 'transparent',
    color: '$primaryText',
    hoverBackgroundColor: '$primaryHover',
    pressBackgroundColor: '$primaryPress',
  },
  secondary: {
    // Figma: secondary/base bg + ink/Darker text (contrast on yellow).
    backgroundColor: '$secondary',
    borderColor: 'transparent',
    color: '$inkDarker',
    hoverBackgroundColor: '$secondaryHover',
    pressBackgroundColor: '$secondaryPress',
  },
  danger: {
    backgroundColor: '$danger',
    borderColor: 'transparent',
    color: '$dangerText',
    hoverBackgroundColor: '$dangerHover',
    pressBackgroundColor: '$dangerPress',
  },
  mutedPrimary: {
    // Figma: sky/Lightest bg + primary/Darker text.
    backgroundColor: '$skyLightest',
    borderColor: 'transparent',
    color: '$primaryDarker',
    hoverBackgroundColor: '$skyLighter',
    pressBackgroundColor: '$skyLight',
  },
} as const

const outlinedTable = {
  primary: {
    backgroundColor: 'transparent',
    borderColor: '$primary',
    color: '$primary',
    hoverBackgroundColor: '$primarySoft',
    pressBackgroundColor: '$primaryLightest',
  },
  secondary: {
    // Border in brand color, but keep ink text (matches filled) for contrast.
    backgroundColor: 'transparent',
    borderColor: '$secondary',
    color: '$inkDarker',
    hoverBackgroundColor: '$secondarySoft',
    pressBackgroundColor: '$secondaryLightest',
  },
  danger: {
    backgroundColor: 'transparent',
    borderColor: '$danger',
    color: '$danger',
    hoverBackgroundColor: '$dangerSoft',
    pressBackgroundColor: '$redLightest',
  },
  mutedPrimary: {
    // Figma exception: neutral sky/Base border + ink/Darker text.
    backgroundColor: 'transparent',
    borderColor: '$skyBase',
    color: '$inkDarker',
    hoverBackgroundColor: '$skyLightest',
    pressBackgroundColor: '$skyLighter',
  },
} as const

// Disabled overrides — same across every variant per Figma spec.
const disabledFilled = {
  backgroundColor: '$skyBase',
  borderColor: 'transparent',
  color: '$skyLightest',
  hoverBackgroundColor: '$skyBase', // no hover affordance when disabled
  pressBackgroundColor: '$skyBase',
} as const

const disabledOutlined = {
  backgroundColor: 'transparent',
  borderColor: '$skyBase',
  color: '$skyBase', // sky/lightest on transparent would be invisible
  hoverBackgroundColor: 'transparent',
  pressBackgroundColor: 'transparent',
} as const

export function resolveButtonAppearance(input: {
  variant: ButtonVariant
  outlined: boolean
  disabled: boolean
}) {
  const { variant, outlined, disabled } = input
  if (disabled) return outlined ? disabledOutlined : disabledFilled
  return outlined ? outlinedTable[variant] : filledTable[variant]
}
