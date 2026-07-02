import { forwardRef, type ReactNode } from 'react'
import type { GetProps } from 'tamagui'
import {
  ButtonFrame,
  ButtonText,
  resolveButtonAppearance,
  type ButtonVariant,
} from './Button.styles'

type FrameProps = GetProps<typeof ButtonFrame>

export interface ButtonProps
  extends Omit<FrameProps, 'children' | 'disabled' | 'role'> {
  /** Color scheme. Defaults to `'primary'`. */
  variant?: ButtonVariant
  /** Render the outlined variant — transparent bg + colored border. */
  outlined?: boolean
  /** Non-interactive state. Sets `aria-disabled`, blocks press, mutes colors. */
  disabled?: boolean
  /** Stretch to the parent's cross-axis width. */
  fullWidth?: boolean
  /**
   * Accessible label — announced by screen readers. Required when `children`
   * is not a plain string (e.g. icon-only buttons). Maps to `aria-label` on
   * both web and React Native (RN 0.71+).
   */
  'aria-label'?: string
  children?: ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = 'primary',
      outlined = false,
      disabled = false,
      fullWidth = false,
      children,
      onPress,
      ...rest
    },
    ref
  ) {
    const appearance = resolveButtonAppearance({ variant, outlined, disabled })

    return (
      <ButtonFrame
        ref={ref as never}
        {...appearance}
        hoverStyle={{ backgroundColor: appearance.hoverBackgroundColor }}
        pressStyle={{
          backgroundColor: appearance.pressBackgroundColor,
          // Tactile "press down" — translateY, so the hitbox stays put.
          // Skipped when disabled (no interaction affordance).
          y: disabled ? 0 : 1,
        }}
        cursor={disabled ? 'not-allowed' : 'pointer'}
        alignSelf={fullWidth ? 'stretch' : 'auto'}
        // --- a11y ---
        // Modern ARIA props — supported on web and RN 0.71+. The deprecated
        // `accessibilityRole` / `accessibilityLabel` / `accessibilityState`
        // props are intentionally omitted (see RN a11y docs).
        // `role="button"` is already set on the ButtonFrame styled base.
        disabled={disabled}
        aria-disabled={disabled || undefined}
        // Swallow presses when disabled — defense in depth (HTML <button disabled>
        // already does this on web, but native needs it too).
        onPress={disabled ? undefined : onPress}
        {...rest}
      >
        {typeof children === 'string' ? (
          <ButtonText color={appearance.color}>{children}</ButtonText>
        ) : (
          children
        )}
      </ButtonFrame>
    )
  }
)
