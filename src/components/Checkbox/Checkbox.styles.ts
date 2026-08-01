import { styled, Stack, Text } from 'tamagui'

/**
 * Checkbox styles — three collaborating pieces:
 *
 *   CheckboxRoot     ← the outer <label> row: pointer target for the whole
 *                      control (box + label), handles hover/press affordance.
 *   CheckboxBox      ← the visible square. Owns bg / border / check glyph.
 *                      Reads a `state` variant driven by the component
 *                      (default / checked / disabled / error / errorChecked).
 *   CheckboxLabel    ← the label text sitting to the right of the box.
 *
 * Why a label wraps everything: on web this gives native click-to-toggle for
 * free — clicking the text focuses/toggles the hidden native input. The
 * hidden input remains the source of truth for form submission and a11y.
 */

// ---------------------------------------------------------------------------
// Root — full-row label. Provides the click target + cursor affordance.
// ---------------------------------------------------------------------------

export const CheckboxRoot = styled(Stack, {
  name: 'CheckboxRoot',
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
// Box — the visible square. All state colours live here.
// ---------------------------------------------------------------------------

export const CheckboxBox = styled(Stack, {
  name: 'CheckboxBox',
  tag: 'span',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '$xs',
  borderWidth: 1.5,
  borderStyle: 'solid',
  flexShrink: 0,

  // Keyboard focus lives on the hidden native input; when that input is
  // `:focus-visible`, the sibling box gets an outline. The style lives on
  // the box because that's what the user sees.
  focusVisibleStyle: {
    outlineColor: '$borderColorFocus',
    outlineWidth: 2,
    outlineStyle: 'solid',
    outlineOffset: 2,
  },

  variants: {
    size: {
      sm: { width: 16, height: 16, borderRadius: 4 },
      md: { width: 20, height: 20, borderRadius: 4 },
    },

    /**
     * Single-prop state — mirrors the pattern in Input.styles. Keeps colour
     * transitions atomic (bg + border always in sync) and avoids props spread
     * juggling at the call site.
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
        backgroundColor: '$primary',
        borderColor: '$primary',
      },
      error: {
        backgroundColor: '$background',
        borderColor: '$danger',
      },
      errorChecked: {
        backgroundColor: '$danger',
        borderColor: '$danger',
      },
      disabled: {
        backgroundColor: '$skyLighter',
        borderColor: '$skyBase',
      },
      disabledChecked: {
        backgroundColor: '$skyBase',
        borderColor: '$skyBase',
      },
    },
  } as const,

  defaultVariants: {
    size: 'md',
    state: 'default',
  },
})

// ---------------------------------------------------------------------------
// Glyph — the check mark / indeterminate dash rendered inside the box.
// Pure CSS glyph (no SVG) so it stays trivially themeable and RN-friendly.
// ---------------------------------------------------------------------------

export const CheckboxGlyph = styled(Text, {
  name: 'CheckboxGlyph',
  color: '$primaryText', // white — sits on the primary/danger fill
  fontWeight: '700',
  lineHeight: 0, // vertical centring of a lone glyph inside the square

  variants: {
    size: {
      sm: { fontSize: 12 },
      md: { fontSize: 14 },
    },
  } as const,

  defaultVariants: { size: 'md' },
})

// Indeterminate uses a horizontal bar (—) rather than a check. Rendered as
// a dedicated Stack so the width can be an exact fraction of the box —
// nicer than a text dash which varies by font metrics.
export const CheckboxIndeterminateBar = styled(Stack, {
  name: 'CheckboxIndeterminateBar',
  backgroundColor: '$primaryText',
  borderRadius: 1,

  variants: {
    size: {
      sm: { width: 8, height: 2 },
      md: { width: 10, height: 2 },
    },
  } as const,

  defaultVariants: { size: 'md' },
})

// ---------------------------------------------------------------------------
// Label + helper text (a11y-friendly description).
// ---------------------------------------------------------------------------

export const CheckboxLabelText = styled(Text, {
  name: 'CheckboxLabelText',
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

export const CheckboxHelperText = styled(Text, {
  name: 'CheckboxHelperText',
  fontFamily: '$body',
  fontSize: 14,
  lineHeight: 20,
  fontWeight: '400',
  marginLeft: 30, // aligns under the label (box width + gap)

  variants: {
    tone: {
      caption: { color: '$inkLighter' },
      error: { color: '$danger' },
    },
  } as const,

  defaultVariants: { tone: 'caption' },
})

// ---------------------------------------------------------------------------
// Resolver — single source of truth for the box's `state` variant.
// ---------------------------------------------------------------------------

export type CheckboxVisualState =
  'default' | 'hover' | 'checked' | 'error' | 'errorChecked' | 'disabled' | 'disabledChecked'

export function resolveCheckboxState(input: {
  disabled: boolean
  checked: boolean
  indeterminate: boolean
  hasError: boolean
}): CheckboxVisualState {
  const { disabled, checked, indeterminate, hasError } = input
  const isMarked = checked || indeterminate
  if (disabled) return isMarked ? 'disabledChecked' : 'disabled'
  if (hasError) return isMarked ? 'errorChecked' : 'error'
  if (isMarked) return 'checked'
  return 'default'
}
