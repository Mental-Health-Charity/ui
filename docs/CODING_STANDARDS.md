# Coding Standards

These standards apply to every file in `src/`. They are enforced by ESLint, Prettier, TypeScript, and pre-commit hooks — but "the linter didn't complain" is not a substitute for reading this document. Some rules are review-time only.

---

## Language

- **All code comments are written in English.** No exceptions — not even in Polish-language conversations with the maintainers. Comments are permanent artefacts that outlast any single conversation and need to be readable by every future contributor.
- **Commit messages are in English.**
- **PR descriptions are in English.**
- **JSDoc is in English.**
- **Storybook story titles and descriptions are in English.**

Chat conversations may be in any language the participants share. Code, docs, git history are English.

---

## Comments

The default is **no comment**. Add one when the _why_ is non-obvious.

**Good comments** explain:

- A hidden constraint (why a value cannot be `0`)
- A subtle invariant (why this order of operations matters)
- A workaround for a specific bug (with the reference)
- Behaviour that would surprise a reader who knows React

**Bad comments** describe _what_ the code does when identifiers already answer that:

```ts
// ✗ Wrong — restates the code
// Set focused to true
setFocused(true)

// ✓ Right — explains a non-obvious reason
// Native `indeterminate` is a DOM property, not an attribute — has to be
// set imperatively after render.
useEffect(() => {
  if (inputRef.current) inputRef.current.indeterminate = indeterminate
}, [indeterminate])
```

**Bad comments** reference the current PR or task ("added for #123", "used by X flow"). Those belong in the PR description and rot as the codebase evolves.

**Never** leave `// TODO:` without a linked issue or a name and date. `// TODO: fix later` in a shared library is technical debt with a bow on it.

---

## Naming

| Kind                       | Convention                   | Example                            |
| -------------------------- | ---------------------------- | ---------------------------------- |
| Component name (React)     | PascalCase                   | `Button`, `CheckboxGroup`          |
| Component file             | PascalCase.tsx               | `Button.tsx`, `CheckboxGroup.tsx`  |
| Non-component file         | camelCase.ts                 | `palette.ts`, `useAutoResize.ts`   |
| Type / interface           | PascalCase                   | `ButtonProps`, `CheckboxSize`      |
| Constant (module-scope)    | UPPER_SNAKE                  | `FALLBACK_LINE_HEIGHT_PX`          |
| Variable / function        | camelCase                    | `handleChange`, `resolveState`     |
| Boolean prop               | `is` / `has` / positive form | `disabled`, `hasError`, `open`     |
| Event handler prop         | `on` + PascalCase            | `onValueChange`, `onCheckedChange` |
| Event handler internal     | `handle` + PascalCase        | `handleChange`, `handleBlur`       |
| CSS class (Tamagui `name`) | PascalCase                   | `InputContainer`, `ButtonFrame`    |

**Component prop naming — semantic over technical:**

- ✓ `onCheckedChange(checked: boolean)` — the domain event
- ✗ `onChange(event: DOMEvent)` — the low-level plumbing

The wrapper's job is to translate DOM/native events into domain events with a clean value type. Consumers should never have to inspect an event.

---

## TypeScript

### Strictness

- No `any`. Use `unknown` and narrow.
- No `@ts-ignore` / `@ts-expect-error` without a comment explaining exactly what is being suppressed and why.
- No non-null assertions (`!`) unless the impossibility is enforced by a type guard immediately above.
- `strict: true` in `tsconfig.json` is on. It stays on.

### Prop interfaces

Every component exports its `Props` interface. Every prop has a JSDoc. Props are the public API of a UI component — they deserve the same care as a REST endpoint.

```ts
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
  // …
}
```

### Union types over enums

Use string literal unions, not TypeScript `enum`:

```ts
// ✓ Right
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'mutedPrimary'

// ✗ Wrong
export enum ButtonVariant {
  Primary,
  Secondary,
  Danger,
  MutedPrimary,
}
```

Literal unions play better with Tamagui variant keys, are tree-shakable, and do not add runtime cost.

### Tamagui prop types

When you need the exact prop type of a styled component:

```ts
import type { GetProps } from 'tamagui'
type ButtonFrameProps = GetProps<typeof ButtonFrame>
```

When you need to pick a single value type from a Tamagui prop (e.g. gap):

```ts
type YStackGap = GetProps<typeof YStack>['gap']
```

---

## Component structure — imports first

Order of import blocks:

1. React
2. React Native types (for TS-only imports use `import type`)
3. Tamagui
4. Third-party (rare)
5. Absolute imports from `src/` (rare in components — components should not depend on other components)
6. Relative imports from the same folder (`./ComponentName.styles`)

Prettier + `eslint-plugin-import` do not enforce this today; do it anyway.

---

## `forwardRef` — always

Every component that renders a DOM/native element must forward a ref to that element. Consumers use refs for focus management, scroll-into-view, animation, and integration with third-party libraries.

```tsx
export const MyComponent = forwardRef<HTMLElement, MyComponentProps>(function MyComponent(
  { ... },
  ref,
) {
  return <MyContainer ref={ref as never} ... />
})
```

The `as never` cast is required because Tamagui's typed refs do not always align with the intended DOM element type. This is a known friction point; keep the cast localised to the ref forward.

---

## Hooks

- `useId()` for every DOM id. Never a random string.
- `useCallback` for handlers passed as props to other components (avoids child re-renders).
- `useMemo` for context values (mandatory) and for computed values that are expensive to derive (rare in UI code).
- `useEffect` for imperative post-render work (setting native DOM properties, subscribing to events).
- `useLayoutEffect` when the effect must run before paint (measurement). SSR-guard it.

The dependency array must be exhaustive. `eslint-plugin-react-hooks` catches most violations; do not disable the rule.

---

## Error handling

- **Do not add error handling for scenarios that cannot happen.** No `try/catch` around synchronous JSX. No defensive `if (typeof value === 'string')` checks on typed values.
- **Do validate at system boundaries.** Optional runtime type-check on props coming from an untyped API is fine — but that logic belongs in the consumer, not in the UI component.
- **Throw for programmer errors, not runtime errors.** If a component receives an invalid combination of props (e.g. `checked` and `defaultChecked` both set), a `console.warn` in development is enough. Do not `throw` — it takes down the consumer's app for a lint-level issue.

---

## Accessibility

Non-negotiable. Every component ships with:

- `role` where the primitive does not imply it
- `aria-invalid`, `aria-describedby`, `aria-required` on form fields
- `htmlFor` on labels, matching `id` on fields
- `<fieldset>` + `<legend>` on grouped controls
- Keyboard reachability (`tabIndex={0}` where custom-focus is added)
- `focusVisibleStyle` for visible focus rings

Refer to the WAI-ARIA Authoring Practices for the pattern that matches your component. If the pattern is complex (combobox, listbox, menubar), use a Tamagui primitive — do not roll your own a11y.

**ARIA rules with subtleties:**

- `aria-invalid` is not valid on `role="radio"`. Put it on the enclosing `role="radiogroup"` instead.
- `aria-checked` is automatic on `<input type="checkbox">` / `<input type="radio">` — do not duplicate it.
- `role="switch"` on an `<input type="checkbox">` overrides the default checkbox semantics.

---

## Formatting

Prettier config lives in `.prettierrc` and is enforced pre-commit. The important choices:

- 2 spaces, no tabs
- Single quotes, no semicolons
- Trailing commas everywhere
- 100-character line width
- LF line endings (Windows contributors: git's `core.autocrlf` handles the checkout translation)

Do not fight Prettier. If it re-formats your code, that is the canonical formatting.

---

## Linting

ESLint 9 flat config in `eslint.config.mjs`. Highlights:

- `@typescript-eslint/no-unused-vars` — no dead variables
- `eslint-plugin-unused-imports` — dead imports removed automatically on `--fix`
- `eslint-plugin-react-hooks` — exhaustive deps + rules of hooks
- `eslint-plugin-jsx-a11y` — WCAG-level a11y checks
- `eslint-plugin-storybook` — story convention checks

Run before commit:

```bash
npx tsc --noEmit && npx eslint . --max-warnings=0
```

Any warning is a failure. The `--max-warnings=0` flag is baked into `npm run lint`; do not weaken it.

---

## Pre-commit hooks

`husky` + `lint-staged` are configured in `package.json`:

- Staged `.ts/.tsx/.js/.jsx` files run through Prettier then ESLint --fix
- Staged `.json/.md/.yml` files run through Prettier

If the pre-commit hook fails, **do not bypass it.** Fix the underlying issue. Bypassing (`--no-verify`) is grounds for the PR to be reverted.

If the hook is genuinely broken (network issue, corrupted install), report it. Do not work around it.

---

## Git

- Commits are written in imperative present tense: `add`, `fix`, `refactor`, not `added` / `adding`.
- Commit subject line under 72 characters. Body wraps at ~72 as well.
- One logical change per commit. If you find yourself typing "and" in the subject line, split.
- Never `git commit --amend` a commit that has been pushed.
- Never `git rebase -i` or `git reset --hard` a shared branch.
- Never `git push --force` to `main`.

**Branch names:**

- `feat/<scope>` for new components or features
- `fix/<scope>` for bug fixes
- `refactor/<scope>` for behaviour-preserving changes
- `docs/<scope>` for docs-only changes
- `chore/<scope>` for tooling / config
- `test/<scope>` for test-only additions

---

## What NOT to do

- ❌ Copy-paste a component to create a variant instead of using variants
- ❌ Add a wrapper prop that just spreads to the child (`extraStyle`, `wrapperProps`) — consumers already have style-prop access
- ❌ Depend on className strings for behaviour — Tamagui generates them; they are not stable
- ❌ Write DOM queries in a component to talk to a sibling — use context or callbacks
- ❌ Introduce a state machine library for a two-state control — `useState<'idle' | 'active'>` is fine
- ❌ Add barrel files inside a component folder — the one at the folder root is the barrel
- ❌ Wrap Tamagui's `styled()` in your own factory — you lose type inference and readability
- ❌ Reach across component folders for internal exports — internals are internal
- ❌ Rename an exported prop for stylistic reasons — that is a breaking change to consumers
