import {
  forwardRef,
  isValidElement,
  useCallback,
  useId,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type {
  GestureResponderEvent,
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from 'react-native'
import { YStack, type GetProps } from 'tamagui'
import {
  InputContainer,
  InputField,
  InputSlot,
  LabelText,
  HelperText,
  resolveContainerState,
  resolveFieldAppearance,
} from './Input.styles'

type FieldProps = GetProps<typeof InputField>

export interface InputProps extends Omit<FieldProps, 'children' | 'disabled' | 'id' | 'prefix'> {
  /** Text above the input. Renders as `<label htmlFor={id}>` on web. */
  label?: string
  /** Neutral helper text below the input (14px ink/lighter). */
  caption?: string
  /**
   * Error state.
   *   - `string` → renders red helper text (replaces `caption`)
   *   - `true`   → red border only, no helper text
   *   - `false`/`undefined` → no error
   */
  error?: string | boolean
  /** Non-interactive state — muted colours + blocks input. */
  disabled?: boolean
  /**
   * DOM id. Auto-generated via `useId()` if omitted. Set explicitly for
   * external labels or E2E test hooks.
   */
  id?: string
  /**
   * Element rendered before the input — icon, `<Button>`, dropdown, anything.
   *
   * Two behaviours based on interactivity:
   *   - Plain nodes (icon/text) get `pointer-events: none` so clicks fall
   *     through to the field and focus it naturally.
   *   - React elements with `onPress` / `onClick` (buttons, chips) remain
   *     interactive — they handle their own click without stealing focus.
   *
   * If you need custom behaviour, wrap your content in `<InputSlot>` manually.
   */
  prefix?: ReactNode
  /** Same rules as `prefix` but rendered after the input. */
  suffix?: ReactNode
}

/**
 * Text input with optional label, helper/error text, and prefix/suffix slots
 * for icons, buttons and other adornments.
 *
 * Composition inside the container:
 *
 * ```
 * ┌────────────────────────────────────────────────┐
 * │ [prefix]   real <input>              [suffix]  │
 * └────────────────────────────────────────────────┘
 * ```
 *
 * The container owns the visual surface (bg / border / focus outline / 40px
 * height); the field is transparent and borderless. Focus state is tracked
 * with `useState` and forwarded to the container's `state` variant.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    caption,
    error,
    disabled = false,
    id: providedId,
    prefix,
    suffix,
    onFocus,
    onBlur,
    ...rest
  },
  ref,
) {
  const generatedId = useId()
  const id = providedId ?? generatedId
  const helperId = `${id}-helper`

  const [focused, setFocused] = useState(false)
  const fieldRef = useRef<HTMLInputElement | null>(null)

  const hasError = Boolean(error)
  const errorText = typeof error === 'string' ? error : undefined
  const helperText = errorText ?? caption

  const containerState = resolveContainerState({
    disabled,
    focused,
    hasError,
  })
  const fieldAppearance = resolveFieldAppearance({ disabled })

  const handleFocus = useCallback(
    (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setFocused(true)
      onFocus?.(event)
    },
    [onFocus],
  )
  const handleBlur = useCallback(
    (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setFocused(false)
      onBlur?.(event)
    },
    [onBlur],
  )

  // When the surrounding container is pressed (whitespace around the input,
  // an inert prefix icon, etc.), focus the field — matches native `<input>`
  // + `<label>` behaviour and expected DOM affordance.
  const focusFieldFromContainer = useCallback((event: GestureResponderEvent) => {
    // Don't steal focus if the press landed on an interactive slot element
    // that has its own focus target (a button inside the suffix).
    const target = event.target as unknown as HTMLElement | null
    const currentTarget = event.currentTarget as unknown as HTMLElement | null
    if (
      target &&
      target !== currentTarget &&
      typeof target.closest === 'function' &&
      target.closest('button, a, [role="button"], input, select, textarea')
    ) {
      return
    }
    fieldRef.current?.focus()
  }, [])

  const composedRef = useCallback(
    (node: HTMLInputElement | null) => {
      fieldRef.current = node
      if (typeof ref === 'function') ref(node)
      else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node
    },
    [ref],
  )

  return (
    <YStack>
      {label ? (
        <LabelText tag="label" htmlFor={id} marginBottom={8}>
          {label}
        </LabelText>
      ) : null}

      <InputContainer
        state={containerState}
        onPress={disabled ? undefined : focusFieldFromContainer}
        aria-disabled={disabled || undefined}
      >
        {prefix !== undefined && prefix !== null ? (
          <InputSlot side="start" inert={!isInteractive(prefix)}>
            {prefix}
          </InputSlot>
        ) : null}

        <InputField
          ref={composedRef as never}
          id={id}
          {...fieldAppearance}
          // Left / right padding is applied here (rather than a slot) when
          // there is no adornment on that side — so the caret has breathing
          // room against the container's rounded corners.
          paddingLeft={prefix ? 0 : 12}
          paddingRight={suffix ? 0 : 12}
          disabled={disabled}
          editable={!disabled}
          style={disabled ? undefined : ({ caretColor: '#06b7a7' } as never)}
          aria-invalid={hasError || undefined}
          aria-describedby={helperText ? helperId : undefined}
          accessibilityHint={helperText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...rest}
        />

        {suffix !== undefined && suffix !== null ? (
          <InputSlot side="end" inert={!isInteractive(suffix)}>
            {suffix}
          </InputSlot>
        ) : null}
      </InputContainer>

      {helperText ? (
        <HelperText id={helperId} tone={hasError ? 'error' : 'caption'} marginTop={10}>
          {helperText}
        </HelperText>
      ) : null}
    </YStack>
  )
})

/**
 * Best-effort interactivity check: does this node contain a Button, Link,
 * onPress/onClick, or an element with `role="button"`? Used to decide
 * whether the slot should swallow pointer events (inert icons) or forward
 * them to the child (buttons, dropdowns).
 *
 * Not exhaustive — for custom interactive components pass your own slot
 * via `<InputSlot inert={false}>`.
 */
function isInteractive(node: ReactNode): boolean {
  if (!isValidElement(node)) return false
  const props = node.props as {
    onPress?: unknown
    onClick?: unknown
    role?: string
    href?: string
  }
  if (props.onPress || props.onClick) return true
  if (props.role === 'button' || props.role === 'link') return true
  if (props.href) return true
  return false
}

// Re-export the slot so consumers can compose their own advanced adornments.
export { InputSlot } from './Input.styles'
