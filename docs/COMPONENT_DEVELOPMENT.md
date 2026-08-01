# Component Development

This document is a step-by-step guide for adding or substantially modifying a component. Follow every step. Skipping a step usually means the component ships with a subtle inconsistency that surfaces later as a bug in a consumer.

---

## The workflow

### 1. Understand the requirement

Before writing any code:

- Locate the Figma design for the component.
- Identify all visual states: default, hover, focus, pressed, disabled, error, checked, indeterminate, loading, etc.
- Identify all size variants.
- Identify a11y requirements: form submission, keyboard interaction, screen-reader announcement, aria attributes.
- Check whether a Tamagui primitive already covers the behaviour. If yes, read [TAMAGUI_USAGE.md](./TAMAGUI_USAGE.md) — you are wrapping, not building from scratch.

If any of the above is missing, ask before proceeding.

### 2. Branch off `main`

```bash
git checkout main
git pull origin main
git checkout -b feat/<component-name-in-kebab>
```

One branch per component. If a change touches multiple components, either:

- Split into several branches (preferred — each PR is reviewable in isolation), or
- Use one branch with a clear scope declared in the PR body.

### 3. Create the folder-per-component structure

```bash
mkdir src/components/MyComponent
```

Create the four files (see [ARCHITECTURE.md](./ARCHITECTURE.md) for the rule):

- `MyComponent.styles.ts`
- `MyComponent.tsx`
- `MyComponent.stories.tsx`
- `index.ts`

### 4. Write `MyComponent.styles.ts` first

Styles come first because the visual contract is what the consumer sees. Write:

- Base `styled()` components with `name`, `tag`, static tokens, `variants`, `defaultVariants`.
- A `resolveMyComponentState({...})` pure function (if the component has states).
- Any label / helper text `styled(Text, {...})` if this component has them.

**Rules:**

- Every token reference uses a `$name` string — no raw hex, no raw radius or spacing when a token exists. See [DESIGN_TOKENS.md](./DESIGN_TOKENS.md).
- Every variants block ends with `as const`.
- Every variant has a `defaultVariants` entry.
- Every state variant follows the Input pattern — colour keys named after the state (`default`, `focus`, `error`, `errorFocus`, `disabled`).
- Focus indicators use `focusVisibleStyle`, not `focusStyle`.
- No behaviour, no React hooks, no event handlers here.

### 5. Write `MyComponent.tsx`

Anatomy of a correct component file:

```tsx
import { forwardRef, useCallback, useId, useState } from 'react'
import type { NativeSyntheticEvent, TextInputFocusEventData } from 'react-native'
import { YStack } from 'tamagui'
import {
  MyComponentContainer,
  MyComponentField,
  MyComponentLabelText,
  MyComponentHelperText,
  resolveMyComponentState,
  resolveMyComponentAppearance,
} from './MyComponent.styles'

export interface MyComponentProps {
  /** Every public prop has a JSDoc. */
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void

  label?: string
  caption?: string
  error?: string | boolean
  disabled?: boolean

  id?: string
}

/**
 * MyComponent — one-line description of what this control does.
 *
 * Longer paragraph explaining the composition, the state model, and any
 * non-obvious behaviour a consumer needs to know.
 */
export const MyComponent = forwardRef<HTMLElement, MyComponentProps>(function MyComponent(
  {
    value: controlledValue,
    defaultValue,
    onValueChange,
    label,
    caption,
    error,
    disabled = false,
    id: providedId,
  },
  ref,
) {
  const generatedId = useId()
  const id = providedId ?? generatedId
  const helperId = `${id}-helper`

  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? '')
  const isControlled = controlledValue !== undefined
  const value = controlledValue ?? uncontrolledValue

  const hasError = Boolean(error)
  const errorText = typeof error === 'string' ? error : undefined
  const helperText = errorText ?? caption

  const containerState = resolveMyComponentState({ disabled, /* ... */, hasError })
  const fieldAppearance = resolveMyComponentAppearance({ disabled })

  const handleChange = useCallback(
    (next: string) => {
      if (!isControlled) setUncontrolledValue(next)
      onValueChange?.(next)
    },
    [isControlled, onValueChange],
  )

  return (
    <YStack>
      {label ? (
        <MyComponentLabelText tag="label" htmlFor={id} marginBottom={8}>
          {label}
        </MyComponentLabelText>
      ) : null}

      <MyComponentContainer
        state={containerState}
        aria-disabled={disabled || undefined}
      >
        <MyComponentField
          ref={ref as never}
          id={id}
          value={value}
          disabled={disabled}
          aria-invalid={hasError || undefined}
          aria-describedby={helperText ? helperId : undefined}
          onChange={handleChange}
          {...fieldAppearance}
        />
      </MyComponentContainer>

      {helperText ? (
        <MyComponentHelperText id={helperId} tone={hasError ? 'error' : 'caption'} marginTop={10}>
          {helperText}
        </MyComponentHelperText>
      ) : null}
    </YStack>
  )
})
```

**Rules:**

- `forwardRef` on every exported component. Even if you do not think you need it — consumers do.
- `useId()` for every DOM id — never a random string, never a Math.random hack.
- Controlled and uncontrolled both supported: `value` + `onValueChange` OR `defaultValue`. `useState` is initialised from `defaultValue`; `isControlled = controlledValue !== undefined` decides who owns the value.
- `error` is always `string | boolean` — a message OR a red-border-only flag.
- `helperText = errorText ?? caption` — errors replace captions, they do not stack.
- `aria-invalid` and `aria-describedby` always paired with the helper id.
- Comments in English, describing **why** the code is the way it is when the reason is non-obvious. Do not narrate what the code does.

### 6. Write `MyComponent.stories.tsx`

Every visual and behavioural state must have a story. At minimum:

- `Playground` — the interactive `argTypes`-driven story, first in the file.
- `AllStates` — a single canvas that visualises every state side by side (`parameters: { layout: 'fullscreen' }`).

Plus one story per notable variant, one per state combination that is not obvious from `Playground`, and one `Controlled` story that demonstrates external state ownership.

Story files use:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import { YStack } from 'tamagui'
import { MyComponent } from './MyComponent'

const meta: Meta<typeof MyComponent> = {
  title: 'Components/MyComponent',
  component: MyComponent,
  argTypes: {
    label: { control: 'text' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
  },
  args: {
    label: 'Example',
    disabled: false,
  },
  decorators: [
    (Story) => (
      <YStack width={360}>
        <Story />
      </YStack>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof MyComponent>

export const Playground: Story = {}
export const WithError: Story = { args: { error: 'Something went wrong.' } }
// … etc
```

### 7. Write `index.ts`

Two lines. Nothing more.

```ts
export { MyComponent } from './MyComponent'
export type { MyComponentProps } from './MyComponent'
```

If the component ships with a Group / sub-component, add those exports too.

### 8. Wire the barrel

Add the export to `src/components/index.ts`, keeping the file alphabetically-friendly:

```ts
export * from './MyComponent'
```

### 9. Verify

Run all three in the component's directory:

```bash
npx tsc --noEmit
npx eslint src/components/MyComponent src/components/index.ts
```

Then start Storybook and check every state:

```bash
npm run storybook
```

Cross-verify visually:

- Every story renders.
- Focus indicator appears with keyboard `Tab`.
- Hover states behave.
- Disabled state cannot be interacted with.
- Error state shows red border and (when applicable) red helper text.
- Label click focuses the field.
- The component works at 320px, 768px, 1280px widths (resize the window).

### 10. Commit

```bash
git add src/components/MyComponent src/components/index.ts
git commit -m "feat(mycomponent): short imperative summary

Body paragraph explaining WHY this component exists, what problem it
solves, and any non-obvious design decisions. Wrap at ~72 chars."
```

- No `Co-Authored-By: Claude` trailer.
- No `[skip ci]` or hook bypasses.
- Do NOT amend an earlier commit that has been pushed.

### 11. Push and open a PR

```bash
git push -u origin feat/<component-name>
```

PR body should include:

- What the component does
- Design reference (Figma link)
- List of implemented states / variants
- Screenshots or Storybook links
- Anything intentionally left out (with reason)

---

## Compound components (Groups)

For controls that coordinate multiple children (Checkbox → CheckboxGroup, Radio → RadioGroup, future Table → TableRow / TableCell), use React Context.

### Pattern

```tsx
interface MyGroupContextValue {
  value: string[]
  onChange: (next: string[]) => void
  disabled?: boolean
  size?: MySize
  hasError?: boolean
}

const MyGroupContext = createContext<MyGroupContextValue | null>(null)

export const MyGroup = forwardRef<never, MyGroupProps>(function MyGroup({/* ... */}, ref) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? [])
  const isControlled = controlledValue !== undefined
  const value = controlledValue ?? uncontrolledValue

  const handleChange = useCallback(
    (next: string[]) => {
      if (!isControlled) setUncontrolledValue(next)
      onValueChange?.(next)
    },
    [isControlled, onValueChange],
  )

  const context = useMemo<MyGroupContextValue>(
    () => ({ value, onChange: handleChange, disabled, size, hasError }),
    [value, handleChange, disabled, size, hasError],
  )

  return (
    <MyGroupContext.Provider value={context}>
      <YStack tag="fieldset" role="group" aria-labelledby={legendId}>
        {label && (
          <MyLabelText tag="legend" id={legendId}>
            {label}
          </MyLabelText>
        )}
        <YStack>{children}</YStack>
        {helperText && (
          <MyHelperText tone={hasError ? 'error' : 'caption'}>{helperText}</MyHelperText>
        )}
      </YStack>
    </MyGroupContext.Provider>
  )
})

// In the child:
const group = useContext(MyGroupContext)
const disabled = localDisabled ?? group?.disabled ?? false // local wins
```

**Rules:**

- Local child props ALWAYS win over group props. Document this in JSDoc.
- Group uses `<fieldset>` + `<legend>` for a11y — mandatory.
- Context value memoised via `useMemo` — otherwise every child re-renders on every parent render.
- Group supports controlled and uncontrolled just like a single component.

---

## Common questions

### "Where do I put constants like `FALLBACK_LINE_HEIGHT_PX`?"

Top of the `.tsx` file, uppercase, with a comment explaining the source. If the constant is shared across components, promote it to `src/tokens/` or a small `src/utils/` module.

### "My component needs a native DOM feature (like `getComputedStyle`)."

See [CROSS_PLATFORM.md](./CROSS_PLATFORM.md) — guard with `typeof window !== 'undefined'` and provide a native-safe fallback.

### "Should I add a `className` prop for consumer overrides?"

No. Consumers style through props (Tamagui accepts `padding`, `margin`, `backgroundColor`, etc. as inline props). If they need drastic overrides, they should use `styled()` themselves.

### "Should I accept `children`?"

Only when the component is genuinely a container. Controls (Input, Select, Switch) do not accept `children` — they render their own internal composition. Compound children (`CheckboxGroup > Checkbox`) accept `children` only on the parent.

### "Should I export the internal `styled()` components from `index.ts`?"

Only if they are documented public API pieces (e.g. `InputSlot` — advanced consumers building custom adornments). Otherwise keep them internal.

### "Can I make a component do more than one thing?"

No. Split.

---

## PR checklist — must pass before merge

- [ ] Component lives in `src/components/<Name>/` with the four required files.
- [ ] `.styles.ts` has variants, resolver, `as const`, `defaultVariants`.
- [ ] `.tsx` uses `forwardRef`, `useId`, controlled+uncontrolled pattern.
- [ ] All colours, radii, spacing are tokens (or raw with an inline `//` reason).
- [ ] A11y attributes present: `aria-invalid`, `aria-describedby`, `role`, `<label htmlFor>` for form controls.
- [ ] Stories include `Playground`, `AllStates`, and one story per non-obvious variant.
- [ ] `Controlled` story present for stateful components.
- [ ] `npx tsc --noEmit` passes.
- [ ] `npx eslint .` passes (no warnings).
- [ ] Component exported from `src/components/index.ts`.
- [ ] Storybook renders every story without console errors.
- [ ] Visual states verified at 320px, 768px, 1280px.
- [ ] No inline styles or magic numbers where a token exists.
- [ ] No Polish comments; all code comments in English.
- [ ] Commit message follows the format described above.
- [ ] No `Co-Authored-By: Claude` trailer in commits.
