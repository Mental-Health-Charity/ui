import { TextInput } from 'react-native'
import { styled, Text } from 'tamagui'

/**
 * Input styles — geometry, typography, per-state color tables.
 *
 * Kept separate from Input.tsx so the component file stays focused on
 * composition and a11y wiring.
 *
 * IMPORTANT — why we `styled(TextInput)` from react-native (not `styled(Input)`
 * from tamagui):
 *
 * Tamagui's `Input` component is defined as `InputFrame.styleable(...)` around
 * a `TextInput` with an internal `unstyled` variant. When we extend it via
 * `styled(TamaguiInput, {...})`, Tamagui compiles our config into atomic CSS
 * classes (`._height-40px`, `._bg-skyLighter`, …) but the runtime marks the
 * rendered <input> with `data-disable-theme="true"` and never attaches our
 * classes — the element stays visually bare (verified via DOM inspection).
 *
 * Bypassing Tamagui's Input wrapper and extending react-native's TextInput
 * directly avoids the whole variant tangle. `react-native` resolves to
 * `react-native-web` on web via our Vite alias, so the DOM output is still
 * `<input>` (react-native-web's own class-based styling), and our Tamagui
 * classes now attach correctly.
 */

// ---------------------------------------------------------------------------
// Base styled() — Figma constants + a11y affordances
// ---------------------------------------------------------------------------

export const InputFrame = styled(TextInput, {
  name: 'InputFrame',

  // Without this, Tamagui treats react-native's TextInput as "external unknown
  // component" and forwards only inline `style` — our compiled atomic classes
  // (`._height-40px`, `._bg-skyLighter`, …) never get attached to the element.
  // With `acceptsClassName: true` Tamagui knows the rendered DOM element does
  // accept className and applies the classes. See:
  // https://tamagui.dev/docs/core/styled#using-on-the-web
  acceptsClassName: true,

  // Fixed height per design — matches Button minHeight so buttons and inputs
  // line up perfectly when placed side-by-side in a form row.
  height: 40,
  paddingHorizontal: 12,

  borderRadius: 8, // = $sm
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: 'transparent',

  fontFamily: '$body',
  fontSize: 16,
  lineHeight: 21,
  fontWeight: '400',

  // Caret colour on native platforms (Android + iOS selection tint).
  // Web caret uses `caretColor` — see the inline style in Input.tsx.
  cursorColor: '$primary',
  selectionColor: '$primary',

  // Keyboard-only focus outline for WCAG-strong focus visibility, on top of
  // the primary border colour change we apply via `focusStyle` in Input.tsx.
  focusVisibleStyle: {
    outlineColor: '$primary',
    outlineWidth: 2,
    outlineStyle: 'solid',
    outlineOffset: 1,
  },
}, {
  // Third argument — static config. `isInput: true` tells Tamagui to type this
  // as a text-input component (text style props like fontFamily are valid);
  // `accept` tells it to resolve theme tokens on the listed non-style props.
  // Without `accept`, `placeholderTextColor="$inkLight"` reaches
  // react-native-web as the literal string "$inkLight" instead of the resolved
  // colour. Mirrors what Tamagui's own Input does internally.
  isInput: true,
  accept: {
    placeholderTextColor: 'color',
    selectionColor: 'color',
  } as const,
})

// ---------------------------------------------------------------------------
// Label + helper text
// ---------------------------------------------------------------------------

export const LabelText = styled(Text, {
  name: 'InputLabel',
  // Regular size / Medium weight → Sarabun 16/21 @ 500 (Figma "regular/medium").
  fontFamily: '$body',
  fontSize: 16,
  lineHeight: 21,
  fontWeight: '500',
  color: '$color', // $color = inkDarkest in light theme
})

export const HelperText = styled(Text, {
  name: 'InputHelperText',
  // Small size / Regular weight → Sarabun 14/20 @ 400 (Figma "small/regular").
  fontFamily: '$body',
  fontSize: 14,
  lineHeight: 20,
  fontWeight: '400',

  variants: {
    tone: {
      caption: { color: '$inkLighter' },
      error: { color: '$danger' },
    },
  } as const,

  defaultVariants: { tone: 'caption' },
})

// ---------------------------------------------------------------------------
// Appearance table — background / border / text per state
// ---------------------------------------------------------------------------

const defaultAppearance = {
  backgroundColor: '$skyLighter',
  borderColor: 'transparent',
  color: '$inkDarker',
  placeholderTextColor: '$inkLight',
} as const

const disabledAppearance = {
  backgroundColor: '$skyBase',
  borderColor: 'transparent',
  color: '$skyDark',
  placeholderTextColor: '$skyDark',
} as const

const errorAppearance = {
  backgroundColor: '$skyLighter',
  borderColor: '$danger',
  color: '$inkDarker',
  placeholderTextColor: '$inkLight',
} as const

export function resolveInputAppearance(input: {
  disabled: boolean
  hasError: boolean
}) {
  const { disabled, hasError } = input
  if (disabled) return disabledAppearance
  if (hasError) return errorAppearance
  return defaultAppearance
}
