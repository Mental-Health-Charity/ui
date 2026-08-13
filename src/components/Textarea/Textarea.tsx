import { forwardRef, useCallback, useId, useLayoutEffect, useRef, useState } from 'react'
import type { NativeSyntheticEvent, TextInputFocusEventData } from 'react-native'
import { YStack, type GetProps } from 'tamagui'
import {
  TextareaContainer,
  TextareaField,
  TextareaHelperText,
  TextareaLabelText,
  resolveTextareaContainerState,
  resolveTextareaFieldAppearance,
} from './Textarea.styles'

type FieldProps = GetProps<typeof TextareaField>

// Fallback line-height for auto-resize when we can't read the DOM node's
// computed style (SSR, or the initial render before the ref attaches). Kept
// in sync with the TextareaField's `lineHeight` in Textarea.styles.
const FALLBACK_LINE_HEIGHT_PX = 22

export interface TextareaProps extends Omit<
  FieldProps,
  'children' | 'disabled' | 'id' | 'multiline' | 'numberOfLines'
> {
  /** Text above the textarea. Renders as `<label htmlFor={id}>` on web. */
  label?: string
  /** Neutral helper text below the field. */
  caption?: string
  /**
   * Error state.
   *   - `string` → renders red helper text (replaces `caption`)
   *   - `true`   → red border only, no helper text
   *   - `false` / `undefined` → no error
   */
  error?: string | boolean
  /** Non-interactive state. */
  disabled?: boolean
  /**
   * Minimum number of visible lines. Defaults to `3`. When `autoResize` is
   * true, this becomes the initial (and minimum) height.
   */
  rows?: number
  /**
   * Maximum number of lines before the field starts scrolling. Only meaningful
   * with `autoResize`. Omit for unbounded growth.
   */
  maxRows?: number
  /**
   * When true (default), the field grows with content up to `maxRows`. Set
   * `false` for a fixed-height textarea with an internal scrollbar.
   */
  autoResize?: boolean
  /** DOM id. Auto-generated via `useId()` if omitted. */
  id?: string
}

/**
 * Textarea — multiline text input with the same visual language as `<Input>`
 * (bg / border / focus outline / label + helper). Auto-resizes to fit its
 * content by default, capped by `maxRows` when provided.
 *
 * Under the hood: a `TextInput multiline` from react-native (renders as a
 * real `<textarea>` on web via react-native-web). This keeps the API
 * consistent across platforms and lets Tamagui apply its class-based styling
 * without a separate DOM element for web.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    label,
    caption,
    error,
    disabled = false,
    id: providedId,
    rows = 3,
    maxRows,
    autoResize = true,
    onFocus,
    onBlur,
    onChangeText,
    value,
    defaultValue,
    ...rest
  },
  ref,
) {
  const generatedId = useId()
  const id = providedId ?? generatedId
  const helperId = `${id}-helper`

  const [focused, setFocused] = useState(false)
  const fieldRef = useRef<HTMLTextAreaElement | null>(null)

  const hasError = Boolean(error)
  const errorText = typeof error === 'string' ? error : undefined
  const helperText = errorText ?? caption

  const containerState = resolveTextareaContainerState({
    disabled,
    focused,
    hasError,
  })
  const fieldAppearance = resolveTextareaFieldAppearance({ disabled })

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

  // Auto-resize: after every change, reset the height to `auto` (so the
  // element reports its natural scrollHeight, not the previous value), then
  // measure and set to the required height clamped to [rows, maxRows] lines.
  //
  // We keep the min bound as an inline `minHeight` on the container's field
  // so the initial render — before the effect fires — is already at least
  // `rows` tall.
  const resize = useCallback(() => {
    const node = fieldRef.current
    if (!node || !autoResize) return

    const style = typeof window !== 'undefined' ? window.getComputedStyle(node) : null
    const lineHeight = style ? parseFloat(style.lineHeight) : FALLBACK_LINE_HEIGHT_PX
    const effectiveLineHeight =
      Number.isFinite(lineHeight) && lineHeight > 0 ? lineHeight : FALLBACK_LINE_HEIGHT_PX

    // Reset before measuring — otherwise scrollHeight equals the previous
    // height and content-shrink events wouldn't propagate.
    node.style.height = 'auto'
    const contentHeight = node.scrollHeight
    const maxHeight = maxRows ? maxRows * effectiveLineHeight : Infinity
    const nextHeight = Math.min(contentHeight, maxHeight)
    node.style.height = `${nextHeight}px`
    node.style.overflowY = contentHeight > maxHeight ? 'auto' : 'hidden'
  }, [autoResize, maxRows])

  // Re-measure whenever the controlled value changes from the outside.
  useLayoutEffect(() => {
    resize()
  }, [resize, value, defaultValue])

  const handleChangeText = useCallback(
    (text: string) => {
      onChangeText?.(text)
      // Deferred to the next frame so the DOM has committed the new value.
      // `requestAnimationFrame` is the standard hook for post-paint work;
      // scheduling with setTimeout(0) would occasionally race the layout.
      requestAnimationFrame(resize)
    },
    [onChangeText, resize],
  )

  const composedRef = useCallback(
    (node: HTMLTextAreaElement | null) => {
      fieldRef.current = node
      if (typeof ref === 'function') ref(node)
      else if (ref) (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node
    },
    [ref],
  )

  return (
    <YStack>
      {label ? (
        <TextareaLabelText tag="label" htmlFor={id} marginBottom={8}>
          {label}
        </TextareaLabelText>
      ) : null}

      <TextareaContainer state={containerState} aria-disabled={disabled || undefined}>
        <TextareaField
          ref={composedRef as never}
          id={id}
          multiline
          numberOfLines={rows}
          minHeight={rows * FALLBACK_LINE_HEIGHT_PX}
          disabled={disabled}
          editable={!disabled}
          value={value}
          defaultValue={defaultValue}
          style={disabled ? undefined : ({ caretColor: '#06b7a7', resize: 'none' } as never)}
          aria-invalid={hasError || undefined}
          aria-describedby={helperText ? helperId : undefined}
          accessibilityHint={helperText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChangeText={handleChangeText}
          {...fieldAppearance}
          {...rest}
        />
      </TextareaContainer>

      {helperText ? (
        <TextareaHelperText id={helperId} tone={hasError ? 'error' : 'caption'} marginTop={10}>
          {helperText}
        </TextareaHelperText>
      ) : null}
    </YStack>
  )
})
