import { forwardRef, type ReactNode } from 'react'
import type { GestureResponderEvent } from 'react-native'
import type { GetProps } from 'tamagui'
import {
  ChipFrame,
  ChipLabel,
  resolveChipAppearance,
  type ChipColor,
  type ChipVariant,
} from './Chip.styles'

type FrameProps = GetProps<typeof ChipFrame>

/**
 * Cross-platform press handler. On web, Tamagui adapts this to a click event;
 * on native it's a real touch responder event. We use the RN type as the
 * lowest common denominator so the same handler works everywhere.
 */
export type ChipPressHandler = (event: GestureResponderEvent) => void

export interface ChipProps extends Omit<
  FrameProps,
  'children' | 'disabled' | 'size' | 'clickable' | 'onPress'
> {
  /** Colour scheme. Defaults to `'default'` (neutral). */
  color?: ChipColor
  /** Visual style. Defaults to `'filled'`. */
  variant?: ChipVariant
  /** Size preset. Defaults to `'md'`. */
  size?: 'sm' | 'md' | 'lg'
  /** Non-interactive state — mutes colours, blocks click/delete. */
  disabled?: boolean
  /** Icon or ReactNode rendered before the label. */
  startIcon?: ReactNode
  /** Icon or ReactNode rendered after the label. Ignored when `onDelete` is set. */
  endIcon?: ReactNode
  /**
   * When provided, renders a close button and calls this on click. The click
   * event does not bubble to `onPress` — the two actions are independent.
   */
  onDelete?: ChipPressHandler
  /** Optional a11y label for the delete button (default: "Remove"). */
  deleteAccessibilityLabel?: string
  /** Makes the chip act as a button (adds pointer, keyboard focus, press animation). */
  onPress?: ChipPressHandler
  children?: ReactNode
}

/**
 * Compact label / status / filter pill.
 *
 * Works as:
 *   - a static tag: `<Chip>Draft</Chip>`
 *   - a clickable filter: `<Chip onPress={...}>Category</Chip>`
 *   - a removable token: `<Chip onDelete={...}>tag</Chip>`
 *
 * `startIcon`/`endIcon` accept any ReactNode. Pass icons at the size that
 * matches the chip's `size` prop — the frame won't scale them for you.
 */
export const Chip = forwardRef<HTMLSpanElement, ChipProps>(function Chip(
  {
    color = 'default',
    variant = 'filled',
    size = 'md',
    disabled = false,
    startIcon,
    endIcon,
    onDelete,
    onPress,
    deleteAccessibilityLabel = 'Remove',
    children,
    ...rest
  },
  ref,
) {
  const appearance = resolveChipAppearance({ color, variant })
  const isInteractive = Boolean(onPress) && !disabled

  return (
    <ChipFrame
      ref={ref as never}
      {...appearance}
      size={size}
      clickable={isInteractive}
      disabled={disabled}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      aria-disabled={disabled || undefined}
      onPress={isInteractive ? onPress : undefined}
      {...rest}
    >
      {startIcon}
      {typeof children === 'string' ? (
        <ChipLabel size={size} color={appearance.color}>
          {children}
        </ChipLabel>
      ) : (
        children
      )}
      {onDelete ? (
        <DeleteButton
          color={appearance.color}
          disabled={disabled}
          onPress={onDelete}
          accessibilityLabel={deleteAccessibilityLabel}
        />
      ) : (
        endIcon
      )}
    </ChipFrame>
  )
})

// ---------------------------------------------------------------------------
// Internal — delete button (× glyph in a focusable role="button" span)
// ---------------------------------------------------------------------------

interface DeleteButtonProps {
  color: string
  disabled: boolean
  onPress: ChipPressHandler
  accessibilityLabel: string
}

function DeleteButton({ color, disabled, onPress, accessibilityLabel }: DeleteButtonProps) {
  return (
    <ChipLabel
      tag="span"
      role="button"
      tabIndex={disabled ? undefined : 0}
      aria-label={accessibilityLabel}
      color={color as never}
      opacity={0.7}
      cursor={disabled ? 'not-allowed' : 'pointer'}
      hoverStyle={disabled ? undefined : { opacity: 1 }}
      pressStyle={disabled ? undefined : { opacity: 0.5 }}
      onPress={(event: GestureResponderEvent) => {
        // Prevent the parent chip's onPress from firing when the delete
        // button is clicked — delete and press should be independent.
        event.stopPropagation()
        if (!disabled) onPress(event)
      }}
    >
      ×
    </ChipLabel>
  )
}
