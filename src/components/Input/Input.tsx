import { forwardRef, useId } from 'react'
import { YStack, type GetProps } from 'tamagui'
import {
  InputFrame,
  LabelText,
  HelperText,
  resolveInputAppearance,
} from './Input.styles'

type FrameProps = GetProps<typeof InputFrame>

export interface InputProps
  extends Omit<FrameProps, 'children' | 'disabled' | 'id'> {
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
   * DOM id. Auto-generated via `useId()` if omitted. Explicitly set it if
   * you need a stable id (e.g. for testing or external labels).
   */
  id?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, caption, error, disabled = false, id: providedId, ...rest },
  ref
) {
  const generatedId = useId()
  const id = providedId ?? generatedId
  const helperId = `${id}-helper`

  const hasError = Boolean(error)
  const errorText = typeof error === 'string' ? error : undefined
  const helperText = errorText ?? caption

  const appearance = resolveInputAppearance({ disabled, hasError })

  return (
    <YStack>
      {label ? (
        // `tag="label"` renders <label> on web (click-to-focus).
        // `htmlFor` links label ↔ input via id. RN ignores the attribute.
        <LabelText
          tag="label"
          htmlFor={id}
          marginBottom={8}
        >
          {label}
        </LabelText>
      ) : null}

      <InputFrame
        ref={ref as never}
        id={id}
        {...appearance}
        focusStyle={
          disabled
            ? undefined
            : { borderColor: hasError ? '$danger' : '$primary' }
        }
        disabled={disabled}
        editable={!disabled}
        // Web caret colour — `caretColor` is a CSS-only prop that
        // react-native-web forwards to the DOM input at runtime. It isn't
        // in RN's `TextStyle` types so we cast; hard-code the hex because
        // CSS custom properties aren't set up in the current pipeline.
        style={
          disabled
            ? undefined
            : ({ caretColor: '#06b7a7' } as never)
        }
        // --- a11y ---
        aria-disabled={disabled || undefined}
        aria-invalid={hasError || undefined}
        aria-describedby={helperText ? helperId : undefined}
        // RN doesn't resolve aria-describedby to DOM text — expose the same
        // string via accessibilityHint so screen readers on iOS/Android still
        // announce the caption/error when the field receives focus.
        accessibilityHint={helperText}
        {...rest}
      />

      {helperText ? (
        <HelperText
          id={helperId}
          tone={hasError ? 'error' : 'caption'}
          marginTop={10}
        >
          {helperText}
        </HelperText>
      ) : null}
    </YStack>
  )
})
