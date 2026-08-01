import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useId,
  useMemo,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { YStack, type GetProps } from 'tamagui'
import {
  RadioDot,
  RadioHelperText,
  RadioLabelText,
  RadioRing,
  RadioRoot,
  resolveRadioDotTone,
  resolveRadioState,
} from './Radio.styles'

type YStackGap = GetProps<typeof YStack>['gap']

export type RadioSize = 'sm' | 'md'

export interface RadioProps {
  /** The value this radio contributes to the parent RadioGroup. */
  value: string
  /**
   * Optional controlled `checked`. Rarely used — for a standalone Radio not
   * wrapped in RadioGroup (e.g. a two-option layout using two Radios).
   */
  checked?: boolean
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  /** Non-interactive state. Group `disabled` also cascades. */
  disabled?: boolean
  /** Text label shown to the right of the ring. */
  label?: ReactNode
  /** Neutral helper text below the label. */
  caption?: ReactNode
  /**
   * Error state — overrides caption when a string. Usually driven by the
   * parent RadioGroup rather than set per-radio.
   */
  error?: string | boolean
  /** Size preset. Inherited from RadioGroup when omitted. */
  size?: RadioSize
  /** DOM id. Auto-generated via `useId()` if omitted. */
  id?: string
  /** Native name — overrides group's `name`. */
  name?: string
}

// ---------------------------------------------------------------------------
// Group context — the primary API for radios
// ---------------------------------------------------------------------------

interface RadioGroupContextValue {
  value: string | null
  onValueChange: (value: string) => void
  name: string
  disabled?: boolean
  size?: RadioSize
  hasError?: boolean
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null)

// Visually-hidden native input — see Checkbox for the reasoning.
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
 * Radio — single choice within a group. Almost always used as a child of
 * `<RadioGroup>` which supplies `name`, `value`, and `onChange`. Rendering
 * a Radio outside a group is supported (controlled via `checked`/`onChange`)
 * but you lose group-level a11y (fieldset/legend, arrow-key navigation via
 * the shared name attribute).
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  {
    value,
    checked: controlledChecked,
    onChange,
    disabled: disabledProp,
    label,
    caption,
    error,
    size: sizeProp,
    id: providedId,
    name: nameProp,
  },
  ref,
) {
  const group = useContext(RadioGroupContext)

  const disabled = disabledProp ?? group?.disabled ?? false
  const size = sizeProp ?? group?.size ?? 'md'
  const name = nameProp ?? group?.name

  const groupChecked = group ? group.value === value : undefined
  const checked = groupChecked ?? controlledChecked ?? false

  const generatedId = useId()
  const id = providedId ?? generatedId
  const helperId = `${id}-helper`

  const hasError = Boolean(error) || Boolean(group?.hasError)
  const errorText = typeof error === 'string' ? error : undefined
  const helperText = errorText ?? caption

  const ringState = resolveRadioState({ disabled, checked, hasError })
  const dotTone = resolveRadioDotTone({ disabled, hasError })

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) group?.onValueChange(value)
      onChange?.(event)
    },
    [group, onChange, value],
  )

  return (
    <YStack>
      <RadioRoot htmlFor={id} disabled={disabled}>
        <RadioRing size={size} state={ringState}>
          {checked ? <RadioDot size={size} tone={dotTone} /> : null}

          <input
            ref={ref}
            id={id}
            type="radio"
            name={name}
            value={value}
            checked={checked}
            disabled={disabled}
            // NB: aria-invalid is intentionally NOT on individual radios —
            // ARIA forbids it on role="radio". Validation state is announced
            // via the parent RadioGroup's aria-invalid instead.
            aria-describedby={helperText ? helperId : undefined}
            onChange={handleChange}
            style={VISUALLY_HIDDEN}
          />
        </RadioRing>

        {label ? (
          <RadioLabelText size={size} tone={disabled ? 'disabled' : hasError ? 'error' : 'default'}>
            {label}
          </RadioLabelText>
        ) : null}
      </RadioRoot>

      {helperText ? (
        <RadioHelperText id={helperId} tone={hasError ? 'error' : 'caption'}>
          {helperText}
        </RadioHelperText>
      ) : null}
    </YStack>
  )
})

// ---------------------------------------------------------------------------
// RadioGroup — coordinated single-select
// ---------------------------------------------------------------------------

export interface RadioGroupProps {
  /** Controlled selected value. Omit for uncontrolled. */
  value?: string
  /** Uncontrolled initial value. */
  defaultValue?: string
  onValueChange?: (value: string) => void
  /**
   * Shared `name` for all children. Required for native radio semantics
   * (arrow-key nav, single-select at the DOM level). Auto-generated when
   * omitted via `useId()`.
   */
  name?: string
  disabled?: boolean
  size?: RadioSize
  /** Error state applied to every child radio. */
  error?: string | boolean
  /** Group label rendered as a `<legend>` above the radios. */
  label?: ReactNode
  /** Neutral helper below the group. */
  caption?: ReactNode
  orientation?: 'row' | 'column'
  gap?: YStackGap
  children: ReactNode
}

/**
 * RadioGroup — coordinates a list of radios into a single form value.
 * Renders as `<fieldset>` + optional `<legend>` so screen readers announce
 * the whole group as a single labelled control.
 */
export const RadioGroup = forwardRef<never, RadioGroupProps>(function RadioGroup(
  {
    value: controlledValue,
    defaultValue,
    onValueChange,
    name: nameProp,
    disabled,
    size = 'md',
    error,
    label,
    caption,
    orientation = 'column',
    gap = 12,
    children,
  },
  ref,
) {
  const generatedName = useId()
  const name = nameProp ?? generatedName
  const legendId = label ? `${generatedName}-legend` : undefined

  const [uncontrolledValue, setUncontrolledValue] = useState<string | null>(defaultValue ?? null)
  const isControlled = controlledValue !== undefined
  const value = isControlled ? (controlledValue ?? null) : uncontrolledValue

  const hasError = Boolean(error)
  const errorText = typeof error === 'string' ? error : undefined
  const helperText = errorText ?? caption

  const handleValueChange = useCallback(
    (next: string) => {
      if (!isControlled) setUncontrolledValue(next)
      onValueChange?.(next)
    },
    [isControlled, onValueChange],
  )

  const context = useMemo<RadioGroupContextValue>(
    () => ({ value, onValueChange: handleValueChange, name, disabled, size, hasError }),
    [value, handleValueChange, name, disabled, size, hasError],
  )

  return (
    <RadioGroupContext.Provider value={context}>
      <YStack
        ref={ref as never}
        tag="fieldset"
        borderWidth={0}
        padding={0}
        margin={0}
        role="radiogroup"
        aria-labelledby={legendId}
        aria-invalid={hasError || undefined}
      >
        {label ? (
          <RadioLabelText id={legendId} tag="legend" size={size} marginBottom={8} fontWeight="500">
            {label}
          </RadioLabelText>
        ) : null}

        <YStack
          flexDirection={orientation === 'row' ? 'row' : 'column'}
          flexWrap={orientation === 'row' ? 'wrap' : 'nowrap'}
          gap={gap}
        >
          {children}
        </YStack>

        {helperText ? (
          <RadioHelperText marginTop={8} marginLeft={0} tone={hasError ? 'error' : 'caption'}>
            {helperText}
          </RadioHelperText>
        ) : null}
      </YStack>
    </RadioGroupContext.Provider>
  )
})
