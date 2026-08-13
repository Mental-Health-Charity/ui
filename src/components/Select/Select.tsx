import { Fragment, useId, useMemo, useState, type ReactNode } from 'react'
import { Adapt, Sheet, Select as TSelect, YStack } from 'tamagui'
import {
  SelectChevron,
  SelectContentFrame,
  SelectGroupLabel,
  SelectGroupLabelText,
  SelectHelperText,
  SelectItemFrame,
  SelectItemIndicator,
  SelectItemTextValue,
  SelectLabelText,
  SelectTriggerFrame,
  SelectValueText,
  SelectViewportFrame,
  resolveSelectContainerState,
} from './Select.styles'

// ---------------------------------------------------------------------------
// Option shapes
// ---------------------------------------------------------------------------

export interface SelectOption {
  /** Machine value written back via `onValueChange`. */
  value: string
  /** Human label shown in the trigger and in the list. */
  label: string
  /** Non-selectable state — the item is still visible but greyed out. */
  disabled?: boolean
}

export interface SelectOptionGroup {
  /** Section header rendered above the group's options. */
  label: string
  options: SelectOption[]
}

// `options` accepts either a flat list of options or a grouped list. The
// grouped form is auto-detected by the presence of an `options` key.
export type SelectOptionsInput = SelectOption[] | SelectOptionGroup[]

function isGrouped(input: SelectOptionsInput): input is SelectOptionGroup[] {
  const first = input[0]
  return first !== undefined && 'options' in first
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export interface SelectProps {
  /** Options — flat or grouped. */
  options: SelectOptionsInput
  /** Controlled selected value. Omit for uncontrolled. */
  value?: string
  /** Uncontrolled initial value. */
  defaultValue?: string
  onValueChange?: (value: string) => void
  /** Text above the trigger. Renders as `<label htmlFor={id}>` on web. */
  label?: string
  /** Neutral helper text below the trigger. */
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
  /** Placeholder shown when no value is selected. */
  placeholder?: string
  /**
   * When true, opens a native-like bottom sheet on touch devices instead of
   * a floating popover. Defaults to `true` since it's better UX on mobile.
   */
  native?: boolean
  /** DOM id. Auto-generated via `useId()` if omitted. */
  id?: string
  /**
   * Optional item renderer. Receives the option and index — return a
   * ReactNode to fully override the row. Falls back to a plain label.
   */
  renderItem?: (option: SelectOption, index: number) => ReactNode
}

/**
 * Select — labelled single-select dropdown built on top of Tamagui's Select
 * primitive. Trigger looks like an Input (same 40px height, radius, focus
 * outline); popover uses `<Sheet>` adaptation on touch devices for a native
 * feel via `Adapt`.
 *
 * The primitive handles a11y (arrow keys, type-ahead, focus trapping,
 * ARIA combobox semantics), portalling and platform adaptation — this
 * wrapper only styles it and exposes a compact `options={[…]}` API.
 */
export function Select({
  options,
  value: controlledValue,
  defaultValue,
  onValueChange,
  label,
  caption,
  error,
  disabled = false,
  placeholder = 'Select an option…',
  native = true,
  id: providedId,
  renderItem,
}: SelectProps) {
  const generatedId = useId()
  const id = providedId ?? generatedId
  const helperId = `${id}-helper`

  const [uncontrolledValue, setUncontrolledValue] = useState<string | undefined>(defaultValue)
  const [open, setOpen] = useState(false)
  const isControlled = controlledValue !== undefined
  const value = controlledValue ?? uncontrolledValue

  const hasError = Boolean(error)
  const errorText = typeof error === 'string' ? error : undefined
  const helperText = errorText ?? caption

  const triggerState = resolveSelectContainerState({ disabled, open, hasError })

  const handleValueChange = (next: string) => {
    if (!isControlled) setUncontrolledValue(next)
    onValueChange?.(next)
  }

  // Flatten for index math (Tamagui requires each Item to declare its `index`
  // so keyboard navigation and highlighting resolve to a stable position).
  const flatOptions = useMemo(() => {
    if (isGrouped(options)) {
      return options.flatMap((g) => g.options)
    }
    return options
  }, [options])

  const selectedLabel = useMemo(() => {
    if (value === undefined) return undefined
    return flatOptions.find((o) => o.value === value)?.label
  }, [flatOptions, value])

  return (
    <YStack>
      {label ? (
        <SelectLabelText tag="label" htmlFor={id} marginBottom={8}>
          {label}
        </SelectLabelText>
      ) : null}

      <TSelect
        id={id}
        value={value}
        onValueChange={handleValueChange}
        open={open}
        onOpenChange={setOpen}
        disablePreventBodyScroll
      >
        <SelectTriggerFrame
          state={triggerState}
          disabled={disabled}
          aria-invalid={hasError || undefined}
          aria-describedby={helperText ? helperId : undefined}
        >
          <SelectValueText placeholder={placeholder}>{selectedLabel}</SelectValueText>
          <SelectChevron>▾</SelectChevron>
        </SelectTriggerFrame>

        {/* Adapt swaps the popover for a bottom Sheet at the `sm` breakpoint
            (or smaller) so touch users get a familiar mobile picker. */}
        {native ? (
          <Adapt when="maxMd" platform="touch">
            <Sheet native modal dismissOnSnapToBottom snapPointsMode="fit">
              <Sheet.Frame padding={0}>
                <Adapt.Contents />
              </Sheet.Frame>
              <Sheet.Overlay backgroundColor="$overlay" />
            </Sheet>
          </Adapt>
        ) : null}

        <SelectContentFrame>
          <SelectViewportFrame>
            {isGrouped(options)
              ? renderGroupedItems(options, renderItem)
              : renderFlatItems(options, renderItem)}
          </SelectViewportFrame>
        </SelectContentFrame>
      </TSelect>

      {helperText ? (
        <SelectHelperText id={helperId} tone={hasError ? 'error' : 'caption'} marginTop={10}>
          {helperText}
        </SelectHelperText>
      ) : null}
    </YStack>
  )
}

// ---------------------------------------------------------------------------
// Item renderers — factored out so the main component stays skimmable
// ---------------------------------------------------------------------------

function renderFlatItems(
  options: SelectOption[],
  renderItem?: SelectProps['renderItem'],
  indexOffset = 0,
) {
  return options.map((option, i) => (
    <SelectItemFrame
      key={option.value}
      index={indexOffset + i}
      value={option.value}
      disabled={option.disabled}
    >
      {renderItem ? (
        renderItem(option, indexOffset + i)
      ) : (
        <>
          <SelectItemTextValue>{option.label}</SelectItemTextValue>
          <TSelect.ItemIndicator>
            <SelectItemIndicator>✓</SelectItemIndicator>
          </TSelect.ItemIndicator>
        </>
      )}
    </SelectItemFrame>
  ))
}

function renderGroupedItems(groups: SelectOptionGroup[], renderItem?: SelectProps['renderItem']) {
  let running = 0
  return groups.map((group, gi) => {
    const items = renderFlatItems(group.options, renderItem, running)
    running += group.options.length
    return (
      <Fragment key={`${group.label}-${gi}`}>
        <SelectGroupLabel>
          <SelectGroupLabelText>{group.label}</SelectGroupLabelText>
        </SelectGroupLabel>
        {items}
      </Fragment>
    )
  })
}
