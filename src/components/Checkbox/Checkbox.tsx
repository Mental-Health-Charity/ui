import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { YStack, type GetProps } from 'tamagui'

type YStackGap = GetProps<typeof YStack>['gap']
import {
  CheckboxBox,
  CheckboxGlyph,
  CheckboxHelperText,
  CheckboxIndeterminateBar,
  CheckboxLabelText,
  CheckboxRoot,
  resolveCheckboxState,
} from './Checkbox.styles'

export type CheckboxSize = 'sm' | 'md'

export interface CheckboxProps {
  /** Controlled checked state. Omit to use `defaultChecked`. */
  checked?: boolean
  /** Uncontrolled initial checked state. */
  defaultChecked?: boolean
  /**
   * Third visual state — "some but not all children checked". Renders a
   * horizontal bar instead of a check. Does not affect the `checked` value.
   */
  indeterminate?: boolean
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
   *   - `string` → red border + red helper text (replaces `caption`)
   *   - `true`   → red border only
   *   - `false` / `undefined` → no error
   */
  error?: string | boolean
  /** Text label rendered to the right of the box. */
  label?: ReactNode
  /** Neutral helper text below the label. */
  caption?: ReactNode
  /** Size preset. Defaults to `md`. */
  size?: CheckboxSize
  /** DOM id. Auto-generated via `useId()` if omitted. */
  id?: string
  /**
   * When true, allows tab-to-focus without registering in form submission.
   * Rare — used when the checkbox is a purely visual UI toggle.
   */
  form?: string
}

// ---------------------------------------------------------------------------
// Group context — shared value/onChange for multi-select checkbox lists.
// ---------------------------------------------------------------------------

interface CheckboxGroupContextValue {
  value: string[]
  onChange: (next: string[]) => void
  name?: string
  disabled?: boolean
  size?: CheckboxSize
  hasError?: boolean
}

const CheckboxGroupContext = createContext<CheckboxGroupContextValue | null>(null)

/**
 * A native <input type="checkbox"> that is *visually* hidden but remains
 * present in the accessibility tree and form submission. Positioning is
 * absolute inside the box so `:focus-visible` and `:checked` selectors can
 * drive the sibling visual box.
 *
 * We can't use `display: none` — that removes the input from the tab order
 * and from form data. `opacity: 0` + `pointer-events: none` keeps it
 * functional while invisible.
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
 * Checkbox — labelled binary control with checked / indeterminate / error /
 * disabled states.
 *
 * Web-first implementation: a real `<input type="checkbox">` sits inside the
 * visual box, invisible but focusable, so keyboard navigation, form data and
 * screen-reader semantics come from the platform. The colourful square is a
 * sibling that reacts to the input's state via component props.
 *
 * For multi-select lists, wrap several Checkboxes in `<CheckboxGroup>` — it
 * manages the array of selected values and forwards `name`/`disabled` down.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  {
    checked: controlledChecked,
    defaultChecked,
    indeterminate = false,
    onCheckedChange,
    name: nameProp,
    value,
    disabled: disabledProp,
    error,
    label,
    caption,
    size: sizeProp,
    id: providedId,
    form,
  },
  ref,
) {
  const group = useContext(CheckboxGroupContext)

  // Group-level props win over defaults but never override an explicit local
  // prop. `disabled` and `size` follow this rule; `error` is per-checkbox.
  const disabled = disabledProp ?? group?.disabled ?? false
  const size = sizeProp ?? group?.size ?? 'md'
  const name = nameProp ?? group?.name

  const generatedId = useId()
  const id = providedId ?? generatedId
  const helperId = `${id}-helper`

  // Uncontrolled fallback — only used when no controlled `checked` is passed.
  const [uncontrolledChecked, setUncontrolledChecked] = useState(defaultChecked ?? false)

  // Group membership derives checked-ness from the group's value array.
  const groupChecked = group && value !== undefined ? group.value.includes(value) : undefined

  const isControlled = controlledChecked !== undefined || groupChecked !== undefined
  const checked = groupChecked ?? controlledChecked ?? uncontrolledChecked

  const hasError = Boolean(error) || Boolean(group?.hasError)
  const errorText = typeof error === 'string' ? error : undefined
  const helperText = errorText ?? caption

  const boxState = resolveCheckboxState({ disabled, checked, indeterminate, hasError })

  // Native `indeterminate` is a DOM property, not an attribute — has to be
  // set imperatively after render. This is the standard workaround used by
  // every UI library that supports the state.
  const inputRef = useRef<HTMLInputElement | null>(null)
  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate
  }, [indeterminate])

  const composedRef = useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node
      if (typeof ref === 'function') ref(node)
      else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node
    },
    [ref],
  )

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const next = event.target.checked
      if (!isControlled) setUncontrolledChecked(next)
      onCheckedChange?.(next)

      if (group && value !== undefined) {
        const nextGroup = next ? [...group.value, value] : group.value.filter((v) => v !== value)
        group.onChange(nextGroup)
      }
    },
    [group, isControlled, onCheckedChange, value],
  )

  return (
    <YStack>
      <CheckboxRoot htmlFor={id} disabled={disabled}>
        <CheckboxBox size={size} state={boxState}>
          {indeterminate ? (
            <CheckboxIndeterminateBar size={size} />
          ) : checked ? (
            <CheckboxGlyph size={size}>✓</CheckboxGlyph>
          ) : null}

          <input
            ref={composedRef}
            id={id}
            type="checkbox"
            name={name}
            value={value}
            checked={checked}
            disabled={disabled}
            form={form}
            aria-invalid={hasError || undefined}
            aria-describedby={helperText ? helperId : undefined}
            onChange={handleChange}
            style={VISUALLY_HIDDEN}
          />
        </CheckboxBox>

        {label ? (
          <CheckboxLabelText
            size={size}
            tone={disabled ? 'disabled' : hasError ? 'error' : 'default'}
          >
            {label}
          </CheckboxLabelText>
        ) : null}
      </CheckboxRoot>

      {helperText ? (
        <CheckboxHelperText id={helperId} tone={hasError ? 'error' : 'caption'}>
          {helperText}
        </CheckboxHelperText>
      ) : null}
    </YStack>
  )
})

// ---------------------------------------------------------------------------
// CheckboxGroup — coordinated multi-select of Checkboxes sharing a name.
// ---------------------------------------------------------------------------

export interface CheckboxGroupProps {
  /** Controlled selected values. Omit for uncontrolled. */
  value?: string[]
  /** Uncontrolled initial values. */
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  /** Shared `name` applied to every child checkbox. */
  name?: string
  /** Disables every child. */
  disabled?: boolean
  /** Forwards to every child (children can still override with their own). */
  size?: CheckboxSize
  /** Error state applied to every child. */
  error?: string | boolean
  /** Group label rendered above the checkboxes (as a `<legend>`-style). */
  label?: ReactNode
  /** Neutral helper below the group. */
  caption?: ReactNode
  /** Row (horizontal) or column (vertical) layout. Defaults to `column`. */
  orientation?: 'row' | 'column'
  /** Gap between checkboxes (Tamagui token or px). */
  gap?: YStackGap
  children: ReactNode
}

/**
 * CheckboxGroup — coordinates a list of Checkboxes into a single form value
 * (`string[]`). Renders as a `<fieldset>` with an optional `<legend>` for
 * proper a11y grouping.
 */
export const CheckboxGroup = forwardRef<never, CheckboxGroupProps>(function CheckboxGroup(
  {
    value: controlledValue,
    defaultValue,
    onValueChange,
    name,
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
  const [uncontrolledValue, setUncontrolledValue] = useState<string[]>(defaultValue ?? [])
  const isControlled = controlledValue !== undefined
  const value = controlledValue ?? uncontrolledValue

  const hasError = Boolean(error)
  const errorText = typeof error === 'string' ? error : undefined
  const helperText = errorText ?? caption

  const handleChange = useCallback(
    (next: string[]) => {
      if (!isControlled) setUncontrolledValue(next)
      onValueChange?.(next)
    },
    [isControlled, onValueChange],
  )

  const context = useMemo<CheckboxGroupContextValue>(
    () => ({ value, onChange: handleChange, name, disabled, size, hasError }),
    [value, handleChange, name, disabled, size, hasError],
  )

  const generatedId = useId()
  const legendId = label ? `${generatedId}-legend` : undefined

  return (
    <CheckboxGroupContext.Provider value={context}>
      <YStack
        ref={ref as never}
        tag="fieldset"
        borderWidth={0}
        padding={0}
        margin={0}
        role="group"
        aria-labelledby={legendId}
      >
        {label ? (
          <CheckboxLabelText
            id={legendId}
            tag="legend"
            size={size}
            marginBottom={8}
            fontWeight="500"
          >
            {label}
          </CheckboxLabelText>
        ) : null}

        <YStack
          flexDirection={orientation === 'row' ? 'row' : 'column'}
          flexWrap={orientation === 'row' ? 'wrap' : 'nowrap'}
          gap={gap}
        >
          {children}
        </YStack>

        {helperText ? (
          <CheckboxHelperText marginTop={8} marginLeft={0} tone={hasError ? 'error' : 'caption'}>
            {helperText}
          </CheckboxHelperText>
        ) : null}
      </YStack>
    </CheckboxGroupContext.Provider>
  )
})
