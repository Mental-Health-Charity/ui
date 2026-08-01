import { styled, Stack, Text } from 'tamagui'

/**
 * Radio styles — mirror the Checkbox shape (root + box + label + helper),
 * but the visual "box" is a circle with an inner dot on selection. Kept
 * separate from Checkbox so each control's variant table stays legible;
 * they share visual language via the same theme tokens.
 */

// ---------------------------------------------------------------------------
// Root — full-row label wrapper, same click-target pattern as Checkbox.
// ---------------------------------------------------------------------------

export const RadioRoot = styled(Stack, {
  name: 'RadioRoot',
  tag: 'label',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
  cursor: 'pointer',
  userSelect: 'none',

  variants: {
    disabled: {
      true: {
        cursor: 'not-allowed',
        opacity: 0.6,
      },
    },
  } as const,
})

// ---------------------------------------------------------------------------
// Ring — the outer circle. Colour & border driven by `state`.
// ---------------------------------------------------------------------------

export const RadioRing = styled(Stack, {
  name: 'RadioRing',
  tag: 'span',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 9999,
  borderWidth: 1.5,
  borderStyle: 'solid',
  flexShrink: 0,

  focusVisibleStyle: {
    outlineColor: '$borderColorFocus',
    outlineWidth: 2,
    outlineStyle: 'solid',
    outlineOffset: 2,
  },

  variants: {
    size: {
      sm: { width: 16, height: 16 },
      md: { width: 20, height: 20 },
    },

    /**
     * Radios never fill on selection (unlike Checkboxes) — the inner dot
     * carries the "on" signal. So the ring's states are simpler: only border
     * + background swap for hover/error/disabled.
     */
    state: {
      default: {
        backgroundColor: '$background',
        borderColor: '$borderColor',
      },
      hover: {
        backgroundColor: '$background',
        borderColor: '$borderColorHover',
      },
      checked: {
        backgroundColor: '$background',
        borderColor: '$primary',
      },
      error: {
        backgroundColor: '$background',
        borderColor: '$danger',
      },
      errorChecked: {
        backgroundColor: '$background',
        borderColor: '$danger',
      },
      disabled: {
        backgroundColor: '$skyLighter',
        borderColor: '$skyBase',
      },
      disabledChecked: {
        backgroundColor: '$skyLighter',
        borderColor: '$skyBase',
      },
    },
  } as const,

  defaultVariants: {
    size: 'md',
    state: 'default',
  },
})

// The inner dot — colour follows the ring's state (primary / danger / muted).
export const RadioDot = styled(Stack, {
  name: 'RadioDot',
  borderRadius: 9999,

  variants: {
    size: {
      sm: { width: 8, height: 8 },
      md: { width: 10, height: 10 },
    },
    tone: {
      primary: { backgroundColor: '$primary' },
      error: { backgroundColor: '$danger' },
      disabled: { backgroundColor: '$skyDark' },
    },
  } as const,

  defaultVariants: {
    size: 'md',
    tone: 'primary',
  },
})

// ---------------------------------------------------------------------------
// Label + helper text — identical to Checkbox for visual consistency.
// ---------------------------------------------------------------------------

export const RadioLabelText = styled(Text, {
  name: 'RadioLabelText',
  fontFamily: '$body',
  fontWeight: '400',
  color: '$color',

  variants: {
    size: {
      sm: { fontSize: 14, lineHeight: 20 },
      md: { fontSize: 16, lineHeight: 22 },
    },
    tone: {
      default: { color: '$color' },
      disabled: { color: '$colorMuted' },
      error: { color: '$danger' },
    },
  } as const,

  defaultVariants: {
    size: 'md',
    tone: 'default',
  },
})

export const RadioHelperText = styled(Text, {
  name: 'RadioHelperText',
  fontFamily: '$body',
  fontSize: 14,
  lineHeight: 20,
  fontWeight: '400',
  marginLeft: 30, // aligns under the label (ring width + gap)

  variants: {
    tone: {
      caption: { color: '$inkLighter' },
      error: { color: '$danger' },
    },
  } as const,

  defaultVariants: { tone: 'caption' },
})

// ---------------------------------------------------------------------------
// Resolver
// ---------------------------------------------------------------------------

export type RadioVisualState =
  'default' | 'hover' | 'checked' | 'error' | 'errorChecked' | 'disabled' | 'disabledChecked'

export function resolveRadioState(input: {
  disabled: boolean
  checked: boolean
  hasError: boolean
}): RadioVisualState {
  const { disabled, checked, hasError } = input
  if (disabled) return checked ? 'disabledChecked' : 'disabled'
  if (hasError) return checked ? 'errorChecked' : 'error'
  if (checked) return 'checked'
  return 'default'
}

export type RadioDotTone = 'primary' | 'error' | 'disabled'

export function resolveRadioDotTone(input: { disabled: boolean; hasError: boolean }): RadioDotTone {
  if (input.disabled) return 'disabled'
  if (input.hasError) return 'error'
  return 'primary'
}
