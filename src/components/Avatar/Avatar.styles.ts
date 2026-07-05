import { styled, Stack, Text } from 'tamagui'

/**
 * Avatar styles — circular image container with an initial fallback.
 *
 * Figma defaults:
 *   size 32×32, circular, bg sky.Lighter, initial ink.Light, weight medium.
 *
 * Because avatars come in a range of sizes (24 for dense tables, 40/48 for
 * headers, 64+ for profile pages), the base frame accepts an explicit
 * `size` prop and scales font accordingly.
 */

export const AvatarFrame = styled(Stack, {
  name: 'AvatarFrame',
  tag: 'span',
  overflow: 'hidden',
  borderRadius: 999,
  backgroundColor: '$skyLighter',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  userSelect: 'none',

  variants: {
    ring: {
      // Thin border ring — used by Avatar.Group to visually separate stacked
      // avatars against the parent surface.
      true: {
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: '$background',
      },
    },
  } as const,
})

export const AvatarInitial = styled(Text, {
  name: 'AvatarInitial',
  fontFamily: '$body',
  fontWeight: '500',
  color: '$inkLight',
  textAlign: 'center',
})

// ---------------------------------------------------------------------------
// Group layout
// ---------------------------------------------------------------------------

export const AvatarGroupFrame = styled(Stack, {
  name: 'AvatarGroup',
  tag: 'span',
  flexDirection: 'row',
  alignItems: 'center',
})

/**
 * Convert a size (px) to a sensible font size for the initial. Rough visual
 * rule from Figma / MUI / Chakra: initial is ~40 % of the frame diameter.
 */
export function getInitialFontSize(size: number): number {
  return Math.round(size * 0.4)
}
