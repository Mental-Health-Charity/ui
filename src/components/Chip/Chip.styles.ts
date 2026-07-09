import { styled, Stack, Text } from 'tamagui'

/**
 * Chip styles — base styled() bases + colour tables.
 *
 * The Chip itself is a small pill-shaped element used for tags, filters,
 * selected options and similar. Colour variants map to semantic theme
 * tokens so dark mode and re-branding remain single-file changes.
 */

// ---------------------------------------------------------------------------
// Base frames
// ---------------------------------------------------------------------------

export const ChipFrame = styled(Stack, {
  name: 'ChipFrame',
  tag: 'span',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  alignSelf: 'flex-start',
  gap: 6,
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: 'transparent',
  userSelect: 'none',

  variants: {
    size: {
      sm: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 999 },
      md: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
      lg: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
    },
    clickable: {
      true: {
        cursor: 'pointer',
        pressStyle: { opacity: 0.85 },
        focusVisibleStyle: {
          outlineColor: '$borderColorFocus',
          outlineWidth: 2,
          outlineStyle: 'solid',
          outlineOffset: 2,
        },
      },
    },
    disabled: {
      true: {
        opacity: 0.5,
        cursor: 'not-allowed',
        pointerEvents: 'none',
      },
    },
  } as const,

  defaultVariants: {
    size: 'md',
  },
})

export const ChipLabel = styled(Text, {
  name: 'ChipLabel',
  fontFamily: '$body',
  fontWeight: '500',

  variants: {
    size: {
      sm: { fontSize: 12, lineHeight: 16 },
      md: { fontSize: 14, lineHeight: 18 },
      lg: { fontSize: 16, lineHeight: 20 },
    },
  } as const,

  defaultVariants: {
    size: 'md',
  },
})

// ---------------------------------------------------------------------------
// Colour scheme table — mirrors Button conventions
// ---------------------------------------------------------------------------

export type ChipColor = 'default' | 'primary' | 'secondary' | 'danger' | 'success' | 'muted'

type ChipVariant = 'filled' | 'outlined'

const filledTable = {
  default: {
    backgroundColor: '$backgroundStrong',
    borderColor: 'transparent',
    color: '$color',
  },
  primary: {
    backgroundColor: '$primary',
    borderColor: 'transparent',
    color: '$primaryText',
  },
  secondary: {
    backgroundColor: '$secondary',
    borderColor: 'transparent',
    color: '$secondaryText',
  },
  danger: {
    backgroundColor: '$danger',
    borderColor: 'transparent',
    color: '$dangerText',
  },
  success: {
    backgroundColor: '$success',
    borderColor: 'transparent',
    color: '$successText',
  },
  muted: {
    backgroundColor: '$primarySoft',
    borderColor: 'transparent',
    color: '$primaryTextSoft',
  },
} as const

const outlinedTable = {
  default: {
    backgroundColor: 'transparent',
    borderColor: '$borderColor',
    color: '$color',
  },
  primary: {
    backgroundColor: 'transparent',
    borderColor: '$primary',
    color: '$primary',
  },
  secondary: {
    backgroundColor: 'transparent',
    borderColor: '$secondary',
    color: '$inkDarker',
  },
  danger: {
    backgroundColor: 'transparent',
    borderColor: '$danger',
    color: '$danger',
  },
  success: {
    backgroundColor: 'transparent',
    borderColor: '$success',
    color: '$successText',
  },
  muted: {
    backgroundColor: 'transparent',
    borderColor: '$borderColor',
    color: '$colorMuted',
  },
} as const

export function resolveChipAppearance(input: { color: ChipColor; variant: ChipVariant }) {
  return input.variant === 'outlined' ? outlinedTable[input.color] : filledTable[input.color]
}

export type { ChipVariant }
