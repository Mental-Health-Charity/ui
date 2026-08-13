import { Select as TSelect, styled, Stack, Text } from 'tamagui'

/**
 * Select styles — wraps Tamagui's Select primitives with our design tokens.
 *
 * The wrapper below styles four pieces:
 *
 *   SelectTriggerFrame  ← the visible closed control. Same visual language as
 *                          InputContainer (40px height, $sm radius, primary
 *                          focus border + outline).
 *   SelectContentFrame  ← the popover surface (bg, radius, elevation).
 *   SelectViewportFrame ← the scrollable area inside the popover — inner
 *                          padding + gap between items.
 *   SelectItemFrame     ← a single option row. Hover / focus / selected
 *                          states, driven by Tamagui's built-in variants.
 *
 * Label + helper text are re-defined here to keep the component folder self-
 * contained; they mirror Input's typography for cross-form consistency.
 */

// ---------------------------------------------------------------------------
// Trigger — the closed <button> that opens the popover
// ---------------------------------------------------------------------------

export const SelectTriggerFrame = styled(TSelect.Trigger, {
  name: 'SelectTrigger',
  height: 40,
  paddingHorizontal: 12,
  borderRadius: '$sm',
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: 'transparent',
  backgroundColor: '$skyLighter',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
  cursor: 'pointer',

  variants: {
    // Mirror Input's container state variant.
    state: {
      default: {
        backgroundColor: '$skyLighter',
        borderColor: 'transparent',
      },
      focus: {
        backgroundColor: '$skyLighter',
        borderColor: '$primary',
        outlineColor: '$primary',
        outlineWidth: 2,
        outlineStyle: 'solid',
        outlineOffset: 2,
      },
      error: {
        backgroundColor: '$skyLighter',
        borderColor: '$danger',
      },
      errorFocus: {
        backgroundColor: '$skyLighter',
        borderColor: '$danger',
        outlineColor: '$danger',
        outlineWidth: 2,
        outlineStyle: 'solid',
        outlineOffset: 2,
      },
      disabled: {
        backgroundColor: '$skyBase',
        borderColor: 'transparent',
        cursor: 'not-allowed',
        opacity: 0.7,
      },
    },
  } as const,

  defaultVariants: { state: 'default' },
})

/**
 * Value + placeholder text rendered inside the trigger. `flex: 1` so the
 * chevron icon stays pinned to the right edge regardless of value length.
 */
export const SelectValueText = styled(TSelect.Value, {
  name: 'SelectValueText',
  fontFamily: '$body',
  fontSize: 16,
  lineHeight: 21,
  fontWeight: '400',
  color: '$inkDarker',
  flex: 1,
  textAlign: 'left',
})

/**
 * Chevron rendered on the right side of the trigger. Pure text glyph so it
 * stays crisp on any DPR without an SVG dependency.
 */
export const SelectChevron = styled(Text, {
  name: 'SelectChevron',
  fontFamily: '$body',
  fontSize: 12,
  color: '$inkLight',
  marginLeft: 4,
})

// ---------------------------------------------------------------------------
// Content — popover surface
// ---------------------------------------------------------------------------

export const SelectContentFrame = styled(TSelect.Content, {
  name: 'SelectContent',
  // Content is `position: absolute` overlay; visual chrome lives on the
  // Viewport below. This frame carries only elevation / z-index behaviour
  // that Tamagui hooks into via its Content primitive.
  zIndex: 200000,
})

export const SelectViewportFrame = styled(TSelect.Viewport, {
  name: 'SelectViewport',
  padding: 4,
  borderRadius: '$sm',
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: '$borderColor',
  backgroundColor: '$background',
  shadowColor: '$shadowColor',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 1,
  shadowRadius: 24,
  minWidth: 160,
  maxHeight: 320,
  overflow: 'hidden',
})

// ---------------------------------------------------------------------------
// Item — a single option row
// ---------------------------------------------------------------------------

export const SelectItemFrame = styled(TSelect.Item, {
  name: 'SelectItem',
  paddingHorizontal: 12,
  paddingVertical: 8,
  // Uses $sm (8px) rather than a tighter xs: the item is a full-width row,
  // and the smaller container radius reads better here than a micro-corner.
  borderRadius: '$sm',
  cursor: 'pointer',
  alignItems: 'center',
  flexDirection: 'row',
  gap: 8,
  minHeight: 36,

  hoverStyle: {
    backgroundColor: '$backgroundHover',
  },
  focusStyle: {
    backgroundColor: '$backgroundFocus',
    outlineWidth: 0,
  },
})

export const SelectItemTextValue = styled(TSelect.ItemText, {
  name: 'SelectItemTextValue',
  fontFamily: '$body',
  fontSize: 16,
  lineHeight: 21,
  fontWeight: '400',
  color: '$inkDarker',
  flex: 1,
})

// Checkmark rendered on the currently-selected item. Kept as a small text
// glyph to avoid pulling in an icon library.
export const SelectItemIndicator = styled(Text, {
  name: 'SelectItemIndicator',
  fontFamily: '$body',
  fontSize: 14,
  fontWeight: '700',
  color: '$primary',
  marginLeft: 8,
})

// ---------------------------------------------------------------------------
// Label + helper — reused from the Input pattern
// ---------------------------------------------------------------------------

export const SelectLabelText = styled(Text, {
  name: 'SelectLabelText',
  fontFamily: '$body',
  fontSize: 16,
  lineHeight: 21,
  fontWeight: '500',
  color: '$color',
})

export const SelectHelperText = styled(Text, {
  name: 'SelectHelperText',
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

// Optional row-outer for the group's label inside the popover.
export const SelectGroupLabel = styled(Stack, {
  name: 'SelectGroupLabel',
  paddingHorizontal: 12,
  paddingVertical: 6,
})

export const SelectGroupLabelText = styled(Text, {
  name: 'SelectGroupLabelText',
  fontFamily: '$body',
  fontSize: 12,
  lineHeight: 16,
  fontWeight: '500',
  color: '$inkLight',
  textTransform: 'uppercase',
  letterSpacing: 0.6,
})

// ---------------------------------------------------------------------------
// Container-state resolver — parallels Input.resolveContainerState
// ---------------------------------------------------------------------------

export type SelectContainerState = 'default' | 'focus' | 'error' | 'errorFocus' | 'disabled'

export function resolveSelectContainerState({
  disabled,
  open,
  hasError,
}: {
  disabled: boolean
  open: boolean
  hasError: boolean
}): SelectContainerState {
  if (disabled) return 'disabled'
  if (hasError && open) return 'errorFocus'
  if (hasError) return 'error'
  if (open) return 'focus'
  return 'default'
}
