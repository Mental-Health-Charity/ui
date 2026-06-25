import { styled, Text } from 'tamagui'

/**
 * Typography — 1:1 mirror of Figma Font Variables.
 *
 * Figma convention: `<size>/<weight>` (e.g. `large/bold`). In TS without the slash → `largeBold`.
 * Weights:
 *   - bold = 700
 *   - semibold = 500 (Figma "Medium" — see note in tokens/typography.ts)
 *   - regular = 400
 *
 * Web: variant picks the semantic tag (title* → h1-h3, *body* → p, small/tiny → span).
 * Native: tag is ignored.
 *
 * Override semantics independently of style:
 *   <Typography variant="title1" tag="span">Big text, not a heading</Typography>
 */
export const Typography = styled(Text, {
  name: 'Typography',
  fontFamily: '$body',
  color: '$color',

  variants: {
    variant: {
      // === Titles — always bold ===
      title1: {
        tag: 'h1',
        fontSize: 48,
        lineHeight: 56,
        fontWeight: '700',
      },
      title2: {
        tag: 'h2',
        fontSize: 32,
        lineHeight: 36,
        fontWeight: '700',
      },
      title3: {
        tag: 'h3',
        fontSize: 24,
        lineHeight: 32,
        fontWeight: '700',
      },

      // === Large (18px / 23px) ===
      largeBold: {
        tag: 'p',
        fontSize: 18,
        lineHeight: 23,
        fontWeight: '700',
      },
      largeSemibold: {
        tag: 'p',
        fontSize: 18,
        lineHeight: 23,
        fontWeight: '500',
      },
      largeRegular: {
        tag: 'p',
        fontSize: 18,
        lineHeight: 23,
        fontWeight: '400',
      },

      // === Regular (16px / 21px) — default body text ===
      regularBold: {
        tag: 'p',
        fontSize: 16,
        lineHeight: 21,
        fontWeight: '700',
      },
      regularSemibold: {
        tag: 'p',
        fontSize: 16,
        lineHeight: 21,
        fontWeight: '500',
      },
      regularRegular: {
        tag: 'p',
        fontSize: 16,
        lineHeight: 21,
        fontWeight: '400',
      },

      // === Small (14px / 20px) ===
      smallBold: {
        tag: 'span',
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '700',
      },
      smallSemibold: {
        tag: 'span',
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '500',
      },
      smallRegular: {
        tag: 'span',
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '400',
      },

      // === Tiny (12px / 16px) — e.g. captions, helpers, badge text ===
      tinyBold: {
        tag: 'span',
        fontSize: 12,
        lineHeight: 16,
        fontWeight: '700',
      },
      tinySemibold: {
        tag: 'span',
        fontSize: 12,
        lineHeight: 16,
        fontWeight: '500',
      },
      tinyRegular: {
        tag: 'span',
        fontSize: 12,
        lineHeight: 16,
        fontWeight: '400',
      },
    },

    muted: {
      true: { color: '$colorMuted' },
    },

    align: {
      left: { textAlign: 'left' },
      center: { textAlign: 'center' },
      right: { textAlign: 'right' },
    },
  } as const,

  defaultVariants: {
    variant: 'regularRegular',
  },
})

export type TypographyProps = React.ComponentProps<typeof Typography>
