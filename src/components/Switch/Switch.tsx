import {
  forwardRef,
  useCallback,
  useId,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { YStack } from 'tamagui'
import {
  SwitchHelperText,
  SwitchLabelText,
  SwitchRoot,
  SwitchThumb,
  SwitchTrack,
  getThumbTranslate,
  resolveSwitchState,
  type SwitchSize,
} from './Switch.styles'

export type { SwitchSize }

export interface SwitchProps {
  /** Controlled checked state. Omit to use `defaultChecked`. */
  checked?: boolean
  /** Uncontrolled initial checked state. */
  defaultChecked?: boolean
  /** Change handler. Receives the new `boolean` — not the DOM event. */
  onCheckedChange?: (checked: boolean) => void
  /** Optional native `name` for form submission. */
  name?: string
  /** Optional native `value` — sent with the form when checked. */
  value?: string
  /** Non-interactive state. */
  disabled?: boolean
  /**
   * Error state.
   *   - `string` → red track + red helper text (replaces `caption`)
   *   - `true`   → red track only
   *   - `false` / `undefined` → no error
   */
  error?: string | boolean
  /** Text label rendered next to the switch. */
  label?: ReactNode
  /** Neutral helper text below the label. */
  caption?: ReactNode
  /**
   * When true, renders the label on the left of the switch (thumb on the
   * right). Useful for right-aligned settings lists.
   */
  labelStart?: boolean
  /** Size preset. Defaults to `md`. */
  size?: SwitchSize
  /** DOM id. Auto-generated via `useId()` if omitted. */
  id?: string
  /** Optional form to attach to — passthrough to the native input. */
  form?: string
}

/**
 * Visually-hidden native checkbox — same technique as Checkbox/Radio.
 * A real DOM checkbox behind the visual track so form submission, keyboard
 * activation (space bar) and screen readers all work without custom code.
 */
const VISUALLY_HIDDEN: CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  opacity: 0,
  margin: 0,
  padding: 0,
  cursor: 'inherit',
}

/**
 * Switch — binary on/off toggle. Prefer this over Checkbox when the state
 * takes effect immediately (a setting, a preference) rather than being
 * submitted with a form.
 *
 * Uses a native `<input type="checkbox" role="switch">` under the hood so
 * the platform handles keyboard, focus, and form data. The pill+thumb is a
 * sibling that reacts to the input's `checked` state via component props.
 */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  {
    checked: controlledChecked,
    defaultChecked,
    onCheckedChange,
    name,
    value,
    disabled = false,
    error,
    label,
    caption,
    labelStart = false,
    size = 'md',
    id: providedId,
    form,
  },
  ref,
) {
  const generatedId = useId()
  const id = providedId ?? generatedId
  const helperId = `${id}-helper`

  const [uncontrolledChecked, setUncontrolledChecked] = useState(defaultChecked ?? false)
  const isControlled = controlledChecked !== undefined
  const checked = controlledChecked ?? uncontrolledChecked

  const hasError = Boolean(error)
  const errorText = typeof error === 'string' ? error : undefined
  const helperText = errorText ?? caption

  const trackState = resolveSwitchState({ disabled, checked, hasError })
  const thumbTranslate = checked ? getThumbTranslate(size) : 0

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const next = event.target.checked
      if (!isControlled) setUncontrolledChecked(next)
      onCheckedChange?.(next)
    },
    [isControlled, onCheckedChange],
  )

  return (
    <YStack>
      <SwitchRoot htmlFor={id} disabled={disabled} labelStart={labelStart}>
        <SwitchTrack size={size} state={trackState}>
          <SwitchThumb size={size} x={thumbTranslate} />

          <input
            ref={ref}
            id={id}
            type="checkbox"
            role="switch"
            name={name}
            value={value}
            checked={checked}
            disabled={disabled}
            form={form}
            aria-checked={checked}
            aria-invalid={hasError || undefined}
            aria-describedby={helperText ? helperId : undefined}
            onChange={handleChange}
            style={VISUALLY_HIDDEN}
          />
        </SwitchTrack>

        {label ? (
          <SwitchLabelText
            size={size}
            tone={disabled ? 'disabled' : hasError ? 'error' : 'default'}
          >
            {label}
          </SwitchLabelText>
        ) : null}
      </SwitchRoot>

      {helperText ? (
        <SwitchHelperText id={helperId} tone={hasError ? 'error' : 'caption'} marginTop={6}>
          {helperText}
        </SwitchHelperText>
      ) : null}
    </YStack>
  )
})
