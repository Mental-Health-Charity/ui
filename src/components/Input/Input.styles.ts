import { TextInput } from 'react-native'
import { styled, Stack, Text } from 'tamagui'

/**
 * Input styles — split into three collaborating frames:
 *
 *   InputContainer   ← wraps prefix + field + suffix; owns bg / border /
 *                      focus outline / height. This is the surface the user
 *                      *sees* as "the input".
 *   InputField       ← the real <input> DOM element. Transparent, borderless,
 *                      100% of parent height, flex-1. Focus lives here.
 *   InputSlot        ← wrapper around the prefix or suffix content — handles
 *                      spacing and interactive affordances (`pointer-events`
 *                      on inert slots, cursor on interactive ones).
 *
 * Why the split: prefix/suffix (icons, buttons, dropdowns) must sit *inside*
 * the visual border/background — so the border can't live on the input.
 * See MUI's `InputBase` + `InputAdornment`, Chakra's `InputGroup` / `Element`,
 * Ant's `Input` with `prefix` / `suffix` slots — same pattern.
 *
 * The Container reads a state prop for its border colour rather than using
 * `focus-within` (which Tamagui doesn't model natively) — the component
 * tracks focus with `useState` and passes it in.
 */

// ---------------------------------------------------------------------------
// Container — surface (bg / border / height / focus outline)
// ---------------------------------------------------------------------------

export const InputContainer = styled(Stack, {
  name: 'InputContainer',
  tag: 'div',
  flexDirection: 'row',
  alignItems: 'center',
  height: 40,
  borderRadius: 8, // = $sm
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: 'transparent',
  backgroundColor: '$skyLighter',
  overflow: 'hidden', // clips ripple / hover backgrounds inside adornments

  variants: {
    /**
     * Per-state colour — driven by the component (see resolveContainer).
     * Split like this so a single prop maps to bg + border in tandem and we
     * don't need to spread multiple values at the call site.
     */
    state: {
      default: {
        backgroundColor: '$skyLighter',
        borderColor: 'transparent',
      },
      focus: {
        backgroundColor: '$skyLighter',
        borderColor: '$primary',
      },
      error: {
        backgroundColor: '$skyLighter',
        borderColor: '$danger',
      },
      errorFocus: {
        // Focused while in error: keep the error colour — signals to the user
        // that the field still needs attention. Some libraries switch to
        // primary on focus; we intentionally don't.
        backgroundColor: '$skyLighter',
        borderColor: '$danger',
      },
      disabled: {
        backgroundColor: '$skyBase',
        borderColor: 'transparent',
      },
    },
  } as const,

  defaultVariants: {
    state: 'default',
  },
})

// ---------------------------------------------------------------------------
// Field — the real <input>. Transparent, borderless, no own padding.
// Padding lives on the Container (via slots or the left/right adornment
// margins) so we can adjust it based on whether prefix/suffix are present.
// ---------------------------------------------------------------------------

export const InputField = styled(
  TextInput,
  {
    name: 'InputField',
    acceptsClassName: true, // needed so Tamagui attaches classes to the <input>
    flex: 1,
    height: '100%',
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
    minWidth: 0, // lets the flex child shrink below its intrinsic size

    fontFamily: '$body',
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '400',
    color: '$inkDarker',

    cursorColor: '$primary',
    selectionColor: '$primary',
  },
  {
    isInput: true,
    accept: {
      placeholderTextColor: 'color',
      selectionColor: 'color',
    } as const,
  },
)

// ---------------------------------------------------------------------------
// Slot — prefix or suffix wrapper. Neutral spacing; interactive contents
// (Button, IconButton) keep their own affordances.
// ---------------------------------------------------------------------------

export const InputSlot = styled(Stack, {
  name: 'InputSlot',
  tag: 'span',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  height: '100%',
  paddingHorizontal: 8,

  variants: {
    side: {
      start: { paddingLeft: 12, paddingRight: 8 },
      end: { paddingLeft: 8, paddingRight: 12 },
    },
    inert: {
      // When the slot's content isn't interactive (a plain icon), clicks pass
      // through to the container so the user focuses the field naturally.
      true: {
        pointerEvents: 'none',
      },
    },
  } as const,
})

// ---------------------------------------------------------------------------
// Label + helper text
// ---------------------------------------------------------------------------

export const LabelText = styled(Text, {
  name: 'InputLabel',
  fontFamily: '$body',
  fontSize: 16,
  lineHeight: 21,
  fontWeight: '500',
  color: '$color',
})

export const HelperText = styled(Text, {
  name: 'InputHelperText',
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
// Field appearance — colour + placeholder per state
// ---------------------------------------------------------------------------

const defaultField = {
  color: '$inkDarker',
  placeholderTextColor: '$inkLight',
} as const

const disabledField = {
  color: '$skyDark',
  placeholderTextColor: '$skyDark',
} as const

export function resolveFieldAppearance({ disabled }: { disabled: boolean }) {
  return disabled ? disabledField : defaultField
}

export function resolveContainerState({
  disabled,
  focused,
  hasError,
}: {
  disabled: boolean
  focused: boolean
  hasError: boolean
}): 'default' | 'focus' | 'error' | 'errorFocus' | 'disabled' {
  if (disabled) return 'disabled'
  if (hasError && focused) return 'errorFocus'
  if (hasError) return 'error'
  if (focused) return 'focus'
  return 'default'
}
