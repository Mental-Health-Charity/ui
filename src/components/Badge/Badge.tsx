import { forwardRef, type ReactNode } from 'react'
import type { GetProps } from 'tamagui'
import {
  BadgeFrame,
  BadgeDot,
  BadgeLabel,
  resolveBadgeDotColor,
  type BadgeTone,
} from './Badge.styles'

type FrameProps = GetProps<typeof BadgeFrame>

export interface BadgeProps extends Omit<FrameProps, 'children' | 'size'> {
  /**
   * Semantic tone controlling the dot AND label colour (kept in sync so the
   * badge reads as one unit). Ignored when `dotColor` is passed.
   */
  tone?: BadgeTone
  /**
   * Raw colour applied to BOTH the dot and the label — accepts any Tamagui
   * token (`'$primary'`, `'$greenLighter'`) or CSS colour value. Overrides
   * `tone` when set.
   */
  dotColor?: string
  /** Size preset. Defaults to `'md'`. */
  size?: 'sm' | 'md' | 'lg'
  children?: ReactNode
}

/**
 * Small coloured dot + text label. Used for status ("● Online"),
 * category tags in lists / tables, and other dense contexts where a
 * full-background `<Chip>` would be too heavy.
 *
 * The label colour tracks the dot colour so the badge reads as a single
 * signal. If you need a two-tone treatment (bright dot + neutral label),
 * wrap the pieces manually with the exported `BadgeDot` / `BadgeLabel`
 * or drop down to raw text.
 *
 * ```tsx
 * <Badge tone="success">Online</Badge>
 * <Badge dotColor="$greenLighter">Custom category</Badge>
 * <Badge tone="danger" size="sm">3 failures</Badge>
 * ```
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { tone = 'default', dotColor, size = 'md', children, ...rest },
  ref,
) {
  const resolvedColor = dotColor ?? resolveBadgeDotColor(tone)

  return (
    <BadgeFrame ref={ref as never} size={size} {...rest}>
      <BadgeDot size={size} backgroundColor={resolvedColor as never} />
      {typeof children === 'string' ? (
        <BadgeLabel size={size} color={resolvedColor as never}>
          {children}
        </BadgeLabel>
      ) : (
        children
      )}
    </BadgeFrame>
  )
})
