# Tamagui Usage

Tamagui is the styling engine and primitive library that powers everything in this repository. It handles cross-platform rendering, theme tokens, class-based styling on web, and accessible headless behaviour for complex components.

**The single most important rule in this file:** before you write your own popover, dialog, dropdown, sheet, radio group, switch, tooltip, or animated container, check whether Tamagui already provides it. It almost certainly does — and the primitive already handles accessibility, keyboard navigation, focus trapping, portalling, and platform adaptation that you would otherwise have to re-implement.

---

## The rule

> **Wrap and style Tamagui primitives; do not reimplement them.**

If you find yourself writing:

- A custom focus trap → use `<FocusScope>` from `@tamagui/focus-scope`
- A custom portal → use `<Portal>` from `@tamagui/portal`
- Keyboard arrow-key navigation for a list → use `Select` or `RadioGroup`
- A modal with backdrop and focus management → use `Dialog` or `Sheet`
- A popover attached to a trigger → use `Popover`
- A tooltip with delay + positioning → use `Tooltip`
- An adaptive component that becomes a bottom sheet on mobile → use `Adapt` + `Sheet`

You are re-implementing what already exists. Stop. Wrap the primitive with `styled()` and expose a clean prop API.

---

## Primitives you should know

The following components are shipped by Tamagui and are available via `import { X } from 'tamagui'`. This is not an exhaustive list — check the [Tamagui docs](https://tamagui.dev) for the full surface.

| Primitive                   | Purpose                                                       | Wrap it when…                                        |
| --------------------------- | ------------------------------------------------------------- | ---------------------------------------------------- |
| `Stack`, `XStack`, `YStack` | Flex containers (base, row, column)                           | Building layout — used everywhere                    |
| `Text`, `SizableText`       | Text with typography tokens                                   | Any text content                                     |
| `Button`                    | Base button (we have our own `Button` — reuse ours, not this) | Never — use our `Button`                             |
| `TextInput`                 | Cross-platform text input                                     | Wrapping into `Input` / `Textarea`                   |
| `Select`                    | Fully accessible dropdown with keyboard nav + type-ahead      | Any single-select control — see our `Select`         |
| `Sheet`                     | Bottom sheet / drawer                                         | Mobile-first modals, filter panels                   |
| `Dialog`                    | Modal dialog with backdrop and focus trap                     | Confirmations, forms, alerts                         |
| `Popover`                   | Floating anchored panel                                       | Menus, filter popovers, date-pickers                 |
| `Tooltip`                   | Delayed hover tooltip                                         | Icon labels, help hints                              |
| `Adapt`                     | Swaps a component for a different composition at a breakpoint | Any component that should be a Sheet on mobile       |
| `Portal`                    | Renders children in a portal                                  | When you need to escape overflow / stacking contexts |
| `AlertDialog`               | Confirmation dialog with a11y-mandated destructive flow       | Delete-confirmation, dangerous actions               |
| `RadioGroup`                | Radio-group headless primitive                                | Custom radio-group implementations — we use our own  |
| `Switch`                    | Toggle-switch headless primitive                              | Custom switch — we use our own                       |
| `Checkbox`                  | Checkbox headless primitive                                   | Custom checkbox — we use our own                     |
| `ScrollView`                | Cross-platform scrolling container                            | Long lists inside a fixed height                     |
| `Image`                     | Cross-platform image                                          | Any image content                                    |
| `Anchor`                    | Cross-platform anchor / link                                  | Links — we have our own `Link` which wraps this      |

---

## How to wrap a primitive

The pattern is always the same:

1. **Import** the primitive and any sub-components you need.
2. **Style** each sub-component with `styled(Primitive.SubComponent, { … })` in `.styles.ts`.
3. **Compose** them in the component's `.tsx`, passing your styled versions in place of the raw ones.
4. **Expose** a simple prop API that hides the primitive's complexity.

### Canonical example — Select

```ts
// Select.styles.ts
import { Select as TSelect, styled } from 'tamagui'

export const SelectTriggerFrame = styled(TSelect.Trigger, {
  name: 'SelectTrigger',
  height: 40,
  paddingHorizontal: 12,
  borderRadius: '$sm',
  // … variants, states, etc.
})

export const SelectContentFrame = styled(TSelect.Content, { … })
export const SelectViewportFrame = styled(TSelect.Viewport, { … })
export const SelectItemFrame = styled(TSelect.Item, { … })
```

```tsx
// Select.tsx
import { Adapt, Sheet, Select as TSelect } from 'tamagui'
import { SelectTriggerFrame, SelectContentFrame /* ... */ } from './Select.styles'

export function Select({ options, value, onValueChange /* ... */ }: SelectProps) {
  return (
    <TSelect value={value} onValueChange={onValueChange}>
      <SelectTriggerFrame state={triggerState}>
        <SelectValueText placeholder={placeholder}>{selectedLabel}</SelectValueText>
        <SelectChevron>▾</SelectChevron>
      </SelectTriggerFrame>

      <Adapt when="maxMd" platform="touch">
        <Sheet native modal dismissOnSnapToBottom snapPointsMode="fit">
          <Sheet.Frame padding={0}>
            <Adapt.Contents />
          </Sheet.Frame>
          <Sheet.Overlay backgroundColor="$overlay" />
        </Sheet>
      </Adapt>

      <SelectContentFrame>
        <SelectViewportFrame>{/* render items */}</SelectViewportFrame>
      </SelectContentFrame>
    </TSelect>
  )
}
```

Notice what the wrapper does **not** do:

- It does not manage focus — the primitive does
- It does not handle keyboard nav — the primitive does
- It does not implement portalling — the primitive does
- It does not adapt to mobile — `Adapt` does

The wrapper only:

- Styles the visual chrome via `styled()`
- Exposes a compact `options` API instead of `<Select.Item>` children
- Wires `state` / `disabled` / `error` into the design-system state resolver
- Renders our label + caption + helper text pattern around the trigger

---

## `styled()` — the core API

`styled(Base, { … })` returns a new component with the given style overrides and variants. Two positional arguments:

```ts
export const Button = styled(
  Stack, // base component
  {
    // static styles
    padding: 12,
    borderRadius: '$md',
    variants: {
      // variant tables
      size: {
        sm: { padding: 8 },
        md: { padding: 12 },
      },
    } as const,
    defaultVariants: { size: 'md' },
  },
)
```

A third argument exists for advanced hints — used when styling `TextInput`:

```ts
export const InputField = styled(
  TextInput,
  {
    // ...
  },
  {
    isInput: true, // marks this as a text input
    accept: {
      placeholderTextColor: 'color', // route prop through the theme colour pipeline
      selectionColor: 'color',
    } as const,
  },
)
```

Use this pattern when a `styled(TextInput, ...)` component needs to accept placeholder/selection colours as theme tokens.

---

## Common patterns

### The `name` prop

Every `styled()` call should include a unique `name`:

```ts
export const InputContainer = styled(Stack, {
  name: 'InputContainer',
  // …
})
```

This becomes the component's display name in React DevTools and shows up in Tamagui's compiled class names, making inspection dramatically easier.

### Variants

```ts
variants: {
  size: {
    sm: { padding: 8 },
    md: { padding: 12 },
  },
  state: {
    default: { backgroundColor: '$background' },
    hover: { backgroundColor: '$backgroundHover' },
  },
} as const
```

- **Always end variants with `as const`** — otherwise Tamagui cannot narrow the types and consumers lose autocompletion on variant props.
- **Group related variants under one key** — e.g. all colour transitions under `state`, not one variant per colour prop.
- **Pair with `defaultVariants`** — never leave a variant without a default. Silent undefined breaks the visual contract.

### `hoverStyle` / `pressStyle` / `focusStyle` / `focusVisibleStyle`

Tamagui provides interaction pseudo-styles as first-class props:

```ts
export const ButtonFrame = styled(Stack, {
  // ...
  hoverStyle: { backgroundColor: '$primaryHover' },
  pressStyle: { opacity: 0.9 },
  focusVisibleStyle: {
    outlineColor: '$borderColorFocus',
    outlineWidth: 2,
    outlineStyle: 'solid',
    outlineOffset: 2,
  },
})
```

Use `focusVisibleStyle` (keyboard-only) rather than `focusStyle` for focus rings — a mouse click should not produce a persistent outline.

### `acceptsClassName` for text inputs

When styling `TextInput` on web, Tamagui needs an explicit hint to attach its generated class to the `<input>` element:

```ts
export const InputField = styled(TextInput, {
  name: 'InputField',
  acceptsClassName: true, // required — see the isInput comment in Input.styles.ts
  // ...
})
```

Omit this and your styles will not apply to the DOM element on web. This gotcha cost us a full debugging session — it is documented here to save future contributors that pain.

---

## When to bypass a primitive

Rare, but possible:

- **The primitive's a11y model doesn't fit the use case.** E.g. you need a menu whose items are draggable — Tamagui `Popover` + custom DnD may be cleaner than fighting `Menu`.
- **No primitive exists.** Then build one. But run it past the project first — do not fork a whole popover engine.
- **Performance regression.** Extremely rare. Profile before assuming.

In all three cases, document the reason in the component's JSDoc or in the PR body.

---

## What NOT to do

- ❌ `import { createPortal } from 'react-dom'` — not cross-platform. Use `<Portal>` from Tamagui.
- ❌ Custom `useEffect` with `document.addEventListener('keydown')` for arrow-key nav — use `Select` / `RadioGroup`.
- ❌ Custom `useOutsideClick` hook for closing a popover — the primitives handle this.
- ❌ Wrapping a primitive but not exposing its important props (e.g. hiding `defaultValue` on a `Select` wrapper) — pass through what the primitive supports unless you have a reason to restrict.
- ❌ Wrapping `TSelect.Content` in a `<Portal>` manually — the primitive already portals.
