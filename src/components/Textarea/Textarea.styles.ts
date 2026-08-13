import { TextInput } from 'react-native'
import { styled, Stack, Text } from 'tamagui'

/**
 * Textarea styles — same visual language as Input (bg / border / focus
 * outline) but the container and field allow variable height for multiline
 * content.
 *
 *   TextareaContainer  ← surface (bg, border, focus outline, padding).
 *                        Height flexes with content; no fixed height.
 *   TextareaField      ← styled multiline TextInput. Transparent, borderless,
 *                        fills the container width.
 *
 * Label + helper text are re-used from Input via shared re-exports (see the
 * component file) so the two controls stay visually identical below the
 * field.
 */

// ---------------------------------------------------------------------------
// Container — the surface. Padding lives here (no adornments/slots).
// ---------------------------------------------------------------------------

export const TextareaContainer = styled(Stack, {
  name: 'TextareaContainer',
  tag: 'div',
  flexDirection: 'column',
  borderRadius: '$sm', // 8px — matches Input container radius
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: 'transparent',
  backgroundColor: '$skyLighter',
  paddingHorizontal: 12,
  paddingVertical: 10,
  width: '100%',

  variants: {
    // Mirror of Input's state variant — driven by resolveContainerState.
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
        // Focused while in error: keep the error colour to signal that the
        // field still needs attention (matches Input behaviour).
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
      },
    },
  } as const,

  defaultVariants: {
    state: 'default',
  },
})

// ---------------------------------------------------------------------------
// Field — the actual <textarea> (via TextInput multiline on RN).
// Transparent + borderless: the container owns the surface. Kill browser
// default outline since the container handles focus indication.
// ---------------------------------------------------------------------------

export const TextareaField = styled(
  TextInput,
  {
    name: 'TextareaField',
    acceptsClassName: true,
    width: '100%',
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
    minWidth: 0,

    fontFamily: '$body',
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '400',
    color: '$inkDarker',

    // Suppress the browser's default focus ring on the field itself so
    // consumers don't see two rings stacked (see Input.styles.ts).
    outlineWidth: 0,
    outlineStyle: 'none',

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
// Label + helper text — kept in-file so the Textarea folder is self-
// contained; visually identical to Input's typography.
// ---------------------------------------------------------------------------

export const TextareaLabelText = styled(Text, {
  name: 'TextareaLabel',
  fontFamily: '$body',
  fontSize: 16,
  lineHeight: 21,
  fontWeight: '500',
  color: '$color',
})

export const TextareaHelperText = styled(Text, {
  name: 'TextareaHelperText',
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
// Field appearance + container-state resolver
// ---------------------------------------------------------------------------

const defaultField = {
  color: '$inkDarker',
  placeholderTextColor: '$inkLight',
} as const

const disabledField = {
  color: '$skyDark',
  placeholderTextColor: '$skyDark',
} as const

export function resolveTextareaFieldAppearance({ disabled }: { disabled: boolean }) {
  return disabled ? disabledField : defaultField
}

export function resolveTextareaContainerState({
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
