import { styled, Stack } from 'tamagui'
import { shadows } from '../../tokens/shadows'

/**
 * Card styles — surface primitive with three visual variants.
 *
 * Defaults come from Figma (sky.Lighter background, 16px radius, 10px padding,
 * small shadow). `variant` swaps the surface treatment; `padding` and `gap`
 * are exposed as regular Tamagui props on the frame so consumers can override
 * without dropping to inline style.
 */

export const CardFrame = styled(Stack, {
  name: 'CardFrame',
  tag: 'div',
  flexDirection: 'column',
  padding: 10,
  gap: 12,
  borderRadius: 16,
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: 'transparent',
  backgroundColor: '$skyLighter',

  variants: {
    variant: {
      // Filled surface + shadow (per Figma) — the default "raised" look.
      elevated: {
        backgroundColor: '$skyLighter',
        borderColor: 'transparent',
        ...shadows.small,
      },
      // Transparent bg + visible border. For dense grids / nested cards
      // where shadows would stack visually.
      outlined: {
        backgroundColor: '$background',
        borderColor: '$borderColor',
      },
      // Bg only, no shadow, no border. Cheapest visual weight.
      filled: {
        backgroundColor: '$skyLighter',
        borderColor: 'transparent',
      },
      // No surface at all — just the padding / gap. Useful when Card is
      // used purely as a structural container inside another surface.
      plain: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
      },
    },

    hoverable: {
      true: {
        cursor: 'default',
        hoverStyle: {
          backgroundColor: '$backgroundHover',
        },
      },
    },

    clickable: {
      true: {
        cursor: 'pointer',
        hoverStyle: {
          backgroundColor: '$backgroundHover',
        },
        pressStyle: {
          y: 1,
        },
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
    variant: 'elevated',
  },
})

// Section frames — thin semantic wrappers with sensible defaults so most
// consumers don't have to reach for a YStack manually.

export const CardHeaderFrame = styled(Stack, {
  name: 'CardHeader',
  tag: 'div',
  flexDirection: 'column',
  gap: 4,
})

export const CardBodyFrame = styled(Stack, {
  name: 'CardBody',
  tag: 'div',
  flexDirection: 'column',
  gap: 8,
})

export const CardFooterFrame = styled(Stack, {
  name: 'CardFooter',
  tag: 'div',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
})

export type CardVariant = 'elevated' | 'outlined' | 'filled' | 'plain'
