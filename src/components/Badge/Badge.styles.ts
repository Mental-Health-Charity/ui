import { styled, Stack, Text } from 'tamagui'

/**
 * Badge styles — coloured dot + label.
 *
 * Purpose: a compact status / category indicator (e.g. "● Online",
 * "● In review"). Not the same as `<Chip>` — Chip has a filled background,
 * Badge is text-with-a-dot for tabular / dense contexts.
 */

// Fixed-size dot. The `backgroundColor` is applied at render time from
// either a semantic tone token or a raw colour value.
export const BadgeDot = styled(Stack, {
  name: 'BadgeDot',
  borderRadius: 999,
  flexShrink: 0,

  variants: {
    size: {
      sm: { width: 6, height: 6 },
      md: { width: 8, height: 8 },
      lg: { width: 10, height: 10 },
    },
  } as const,

  defaultVariants: { size: 'md' },
})

export const BadgeFrame = styled(Stack, {
  name: 'BadgeFrame',
  tag: 'span',
  flexDirection: 'row',
  alignItems: 'center',
  alignSelf: 'flex-start',

  variants: {
    size: {
      sm: { gap: 6 },
      md: { gap: 8 },
      lg: { gap: 8 },
    },
  } as const,

  defaultVariants: { size: 'md' },
})

export const BadgeLabel = styled(Text, {
  name: 'BadgeLabel',
  fontFamily: '$body',
  fontWeight: '500',
  // `color` is applied at render time so it stays in lockstep with the dot —
  // see Badge.tsx.

  variants: {
    size: {
      sm: { fontSize: 12, lineHeight: 16 },
      md: { fontSize: 14, lineHeight: 18 },
      lg: { fontSize: 16, lineHeight: 20 },
    },
  } as const,

  defaultVariants: { size: 'md' },
})

// ---------------------------------------------------------------------------
// Tone table — semantic dot colours
// ---------------------------------------------------------------------------

export type BadgeTone = 'default' | 'primary' | 'secondary' | 'danger' | 'success' | 'muted'

const toneTable = {
  default: '$color',
  primary: '$primary',
  secondary: '$secondary',
  danger: '$danger',
  success: '$success',
  muted: '$colorMuted',
} as const

export function resolveBadgeDotColor(tone: BadgeTone) {
  return toneTable[tone]
}
