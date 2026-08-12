import { styled, Stack, Text } from 'tamagui'

/**
 * List styles — semantic list container + item row.
 *
 * Composition:
 *
 *   ListRoot        ← the <ul> / <ol> outer container. Owns spacing between
 *                     items via `gap`. Native browser markers are reset — we
 *                     render our own markers so bullets and numbers look
 *                     identical on web and native.
 *   ListItemRow     ← the <li> row. Two-column flex: marker area + content
 *                     area (which itself splits into leading icon / stacked
 *                     title+description / trailing meta).
 *   ListItemMarker  ← the bullet / number / spacer that sits on the left.
 *   ListItemContent ← the text block (title + optional description).
 *   ListItemMeta    ← the right-aligned trailing content (badge, timestamp,
 *                     chevron, action button).
 *
 * The `variant` prop on both List and Item must match — List passes it down
 * through context (see List.tsx). This lets the item render the right
 * marker without callers repeating the prop on every child.
 */

// ---------------------------------------------------------------------------
// Root — the semantic list container
// ---------------------------------------------------------------------------

export const ListRoot = styled(Stack, {
  name: 'ListRoot',
  // `tag` is overridden at the call site (List.tsx) based on `variant` — ul
  // for bullet/plain/divided, ol for number. Default here is ul.
  tag: 'ul',
  flexDirection: 'column',
  // Reset browser defaults so our custom markers are the only thing shown.
  // React Native ignores these; they only take effect on web.
  // NB: `listStyleType: 'none'` isn't a Tamagui style prop — applied via
  // the inline `style` prop at the render site (see List.tsx) so the type
  // system stays honest.
  margin: 0,
  padding: 0,

  variants: {
    /** Vertical space between items. */
    spacing: {
      compact: { gap: '$xs' },
      cozy: { gap: '$sm' },
      relaxed: { gap: '$md' },
    },

    /**
     * Divided lists get a bottom border on every item *except the last*.
     * That styling lives on ListItemRow via the `divided` variant — the root
     * has no visual affordance for it, only spacing.
     */
    variant: {
      bullet: { gap: '$sm' },
      number: { gap: '$sm' },
      plain: { gap: '$xs' },
      divided: {
        gap: 0, // border between rows carries the visual rhythm
      },
    },
  } as const,

  defaultVariants: {
    variant: 'plain',
    spacing: 'cozy',
  },
})

// ---------------------------------------------------------------------------
// Item row — one line in the list
// ---------------------------------------------------------------------------

export const ListItemRow = styled(Stack, {
  name: 'ListItemRow',
  tag: 'li',
  flexDirection: 'row',
  alignItems: 'flex-start',
  gap: '$sm',
  // Reset browser list-item defaults so our layout is authoritative.
  margin: 0,
  padding: 0,

  variants: {
    size: {
      sm: { paddingVertical: '$xs' },
      md: { paddingVertical: '$sm' },
      lg: { paddingVertical: '$md' },
    },

    /**
     * Divided rows carry a hairline on their bottom edge. The `:last-child`
     * suppression on web is handled by a compound selector we can't express
     * in Tamagui variants — the List component suppresses it on the final
     * item by passing `isLast` (see below).
     */
    divided: {
      true: {
        borderBottomWidth: 1,
        borderBottomStyle: 'solid',
        borderBottomColor: '$borderColor',
      },
    },
    isLast: {
      true: {
        borderBottomWidth: 0,
      },
    },

    /**
     * Interactive rows get a hover / press affordance and become the row's
     * click target. Colour comes from the `state` variant below so a11y and
     * design intents stay coupled.
     */
    interactive: {
      true: {
        cursor: 'pointer',
        paddingHorizontal: '$sm',
        borderRadius: '$sm',
        hoverStyle: { backgroundColor: '$backgroundHover' },
        pressStyle: { backgroundColor: '$backgroundPress' },
        focusVisibleStyle: {
          outlineColor: '$borderColorFocus',
          outlineWidth: 2,
          outlineStyle: 'solid',
          outlineOffset: 2,
        },
      },
    },

    /**
     * Per-state colours for interactive rows. Kept single-prop so callers
     * pass one value and the resolver keeps bg + text in sync.
     */
    state: {
      default: {},
      selected: {
        backgroundColor: '$primarySoft',
      },
      disabled: {
        opacity: 0.55,
        cursor: 'not-allowed',
        pointerEvents: 'none',
      },
    },
  } as const,

  defaultVariants: {
    size: 'md',
    state: 'default',
  },
})

// ---------------------------------------------------------------------------
// Marker — bullet, number, or spacer that sits on the left of each row
// ---------------------------------------------------------------------------

// Wrapper that fixes the marker column width so text below wraps to a
// consistent indent — regardless of whether the marker is a dot, a digit,
// or an icon. Vertical alignment of the actual glyph lives on the glyph
// itself (Bullet vs Number), not here — the two need different offsets:
// bullets are visually centred on the text mid-line, numbers align their
// baseline with the title's baseline via matching `lineHeight`.
export const ListItemMarker = styled(Stack, {
  name: 'ListItemMarker',
  alignItems: 'center',
  justifyContent: 'flex-start',
  flexShrink: 0,

  variants: {
    size: {
      sm: { minWidth: 16 },
      md: { minWidth: 20 },
      lg: { minWidth: 24 },
    },
  } as const,

  defaultVariants: { size: 'md' },
})

// Visual bullet — a small circle rendered with a Stack so it looks identical
// on web and native (browser `list-style: disc` renders slightly differently
// depending on the font). `marginTop` centres the dot on the text's visual
// mid-line at each size — the row uses `alignItems: 'flex-start'`, so
// without an explicit offset the dot would sit at the ascender line and
// look floated above the text.
export const ListItemBullet = styled(Stack, {
  name: 'ListItemBullet',
  borderRadius: '$full',
  backgroundColor: '$inkDarker',

  variants: {
    size: {
      sm: { width: 4, height: 4, marginTop: 8 },
      md: { width: 5, height: 5, marginTop: 9 },
      lg: { width: 6, height: 6, marginTop: 11 },
    },
    tone: {
      default: { backgroundColor: '$inkDarker' },
      muted: { backgroundColor: '$inkLight' },
      primary: { backgroundColor: '$primary' },
    },
  } as const,

  defaultVariants: {
    size: 'md',
    tone: 'default',
  },
})

// Visual number — plain text digit, right-aligned in the marker column.
// No vertical offset: `lineHeight` matches the title's, so both text boxes
// start at the row's top edge and share a baseline naturally. The previous
// (Marker paddingTop + Number marginTop) combo produced a net +2px shift
// because the marker padding and the negative margin didn't cancel.
export const ListItemNumber = styled(Text, {
  name: 'ListItemNumber',
  fontFamily: '$body',
  fontWeight: '500',
  color: '$inkLight',
  textAlign: 'right',

  variants: {
    size: {
      sm: { fontSize: 13, lineHeight: 20 },
      md: { fontSize: 14, lineHeight: 22 },
      lg: { fontSize: 15, lineHeight: 26 },
    },
  } as const,

  defaultVariants: { size: 'md' },
})

// ---------------------------------------------------------------------------
// Leading icon slot — an optional icon to the left of the text (independent
// of the bullet/number marker). Common for feature lists.
// ---------------------------------------------------------------------------

export const ListItemLeading = styled(Stack, {
  name: 'ListItemLeading',
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',

  variants: {
    size: {
      sm: { width: 20, height: 20, paddingTop: 2 },
      md: { width: 24, height: 24, paddingTop: 2 },
      lg: { width: 28, height: 28, paddingTop: 2 },
    },
  } as const,

  defaultVariants: { size: 'md' },
})

// ---------------------------------------------------------------------------
// Content — title + optional description stacked vertically
// ---------------------------------------------------------------------------

export const ListItemContent = styled(Stack, {
  name: 'ListItemContent',
  flexDirection: 'column',
  flex: 1,
  minWidth: 0, // allow the flex child to shrink and wrap long lines
  gap: 2,
})

export const ListItemTitle = styled(Text, {
  name: 'ListItemTitle',
  fontFamily: '$body',
  fontWeight: '400',
  color: '$color',

  variants: {
    size: {
      sm: { fontSize: 14, lineHeight: 20 },
      md: { fontSize: 16, lineHeight: 22 },
      lg: { fontSize: 18, lineHeight: 26 },
    },
    weight: {
      regular: { fontWeight: '400' },
      medium: { fontWeight: '500' },
    },
  } as const,

  defaultVariants: {
    size: 'md',
    weight: 'regular',
  },
})

export const ListItemDescription = styled(Text, {
  name: 'ListItemDescription',
  fontFamily: '$body',
  fontWeight: '400',
  color: '$colorMuted',

  variants: {
    size: {
      sm: { fontSize: 12, lineHeight: 18 },
      md: { fontSize: 14, lineHeight: 20 },
      lg: { fontSize: 15, lineHeight: 22 },
    },
  } as const,

  defaultVariants: { size: 'md' },
})

// ---------------------------------------------------------------------------
// Trailing meta — right-aligned content (badge, timestamp, chevron, action)
// ---------------------------------------------------------------------------

export const ListItemMeta = styled(Stack, {
  name: 'ListItemMeta',
  flexShrink: 0,
  flexDirection: 'row',
  alignItems: 'center',
  gap: '$xs',
  marginLeft: 'auto',
  // Aligns with the title's first-line baseline rather than the row's top
  // edge, so a chevron/badge sits with the title even when a long
  // description wraps beneath.
  paddingTop: 2,
})

// ---------------------------------------------------------------------------
// State resolver
// ---------------------------------------------------------------------------

export type ListItemState = 'default' | 'selected' | 'disabled'

export function resolveListItemState(input: {
  selected: boolean
  disabled: boolean
}): ListItemState {
  if (input.disabled) return 'disabled'
  if (input.selected) return 'selected'
  return 'default'
}
