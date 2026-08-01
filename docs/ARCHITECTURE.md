# Architecture

This document describes how the repository is organised and the invariants that keep it maintainable at scale. Deviations require explicit justification in the PR description.

---

## Repository layout

```
peryskopui/
├── docs/                      ← this documentation
├── src/
│   ├── components/            ← one folder per component
│   │   ├── Button/
│   │   ├── Checkbox/
│   │   ├── Input/
│   │   └── index.ts           ← barrel export of every component
│   ├── config/
│   │   ├── tamagui.config.ts  ← createTamagui() entry — tokens + themes + fonts
│   │   ├── Provider.tsx       ← <TamaguiProvider> wrapper for apps
│   │   └── index.ts
│   ├── tokens/                ← design token source of truth
│   │   ├── palette.ts         ← raw hex → flat colour tokens
│   │   ├── themes.ts          ← semantic light/dark theme mapping
│   │   ├── spacing.ts         ← radius + space scales
│   │   ├── typography.ts      ← Sarabun font config
│   │   ├── shadows.ts         ← shadow tokens
│   │   └── index.ts
│   ├── stories/               ← non-component narrative stories (welcome, tokens)
│   └── index.ts               ← library entry — re-exports components + config
├── .storybook/                ← Storybook config (Vite builder, addons)
├── package.json
└── tsconfig.json
```

The `src/` boundary is what ships. Everything under `docs/`, `.storybook/`, and dev-only configs is excluded from the published bundle.

---

## The folder-per-component rule

Every component lives in its own directory under `src/components/`. The directory contains exactly four files:

```
ComponentName/
├── ComponentName.tsx          ← component logic, forwardRef, hooks, a11y wiring
├── ComponentName.styles.ts    ← styled() bases, variant tables, state resolvers
├── ComponentName.stories.tsx  ← Storybook stories — Playground + AllStates + edge cases
└── index.ts                   ← re-export the public API (`export { ComponentName } from './ComponentName'`)
```

**Why this shape:**

- **`.styles.ts`** is the design-system surface. Reviewing it in isolation answers "what does this component look like in every state" without wading through hook logic.
- **`.tsx`** is the behaviour surface. Reviewing it answers "how does state flow, what a11y is applied, what is controlled vs uncontrolled".
- **`.stories.tsx`** is the contract. Every visual and behavioural state must appear in at least one story so the component is verifiable outside the consuming app.
- **`index.ts`** is a barrel. Never put logic here. Its only job is re-exports so `import { X } from '@peryskop/ui/components/X'` resolves cleanly.

**Violations to avoid:**

- Inline `styled(...)` calls in the `.tsx` file — move them to `.styles.ts`.
- Behaviour (`useState`, event handlers) in `.styles.ts` — keep it declarative.
- Sub-components living in the parent's `.tsx` when they have their own visual identity and state (e.g. `AvatarGroup` gets its own file `Avatar.Group.tsx` OR sits in the parent when trivially small — Chip's internal `DeleteButton` is an example of "small enough to stay in the parent").

---

## The two-layer style pattern

`.styles.ts` is organised in two layers:

### Layer 1 — base `styled()` components with variants

Each visual piece of the component becomes a `styled(Stack, { … })` or `styled(Text, { … })` with:

- Static base styles (typography, spacing, radius from tokens)
- A `variants: { … } as const` map keyed by prop (`size`, `state`, `tone`, …)
- `defaultVariants: { … }`

Colour choices live in variant branches, not at the call site. This means a component consumer never spreads `{ backgroundColor: '...', borderColor: '...' }` — they pass a single prop like `state="focus"`.

### Layer 2 — a `resolveXxxState()` function

A pure function that takes semantic inputs (`{ disabled, focused, hasError }`) and returns the exact `state` variant key. The component (`.tsx`) calls this once per render.

**Canonical example:** `src/components/Input/Input.styles.ts` — see `InputContainer` (variant `state`) + `resolveContainerState({...})`.

**Why this split:** the resolver is trivially unit-testable, and swapping the state machine (e.g. adding a `readonly` state) touches one function plus one variant table — not every consumer.

---

## The container-owns-state pattern

For any control that has a visible surface (border, background, focus ring) **plus** internal moving pieces (input field, thumb, glyph, icon), the surface is a separate component from the pieces:

- **Container** — owns bg / border / height / focus outline / radius. Reads a single `state` variant prop.
- **Field / Thumb / Box** — transparent, borderless, sized to fit inside. Owns typography and interaction.

The container's `state` is driven by the resolver, not by CSS pseudo-selectors like `:focus-within` (which Tamagui does not model natively across web + native). The component uses `useState` for `focused` / `open` / etc. and forwards it in.

**Applies to:** `Input`, `Textarea`, `Select` (Trigger acts as container), `Checkbox` (Box), `Radio` (Ring), `Switch` (Track).

---

## The compound-component pattern (Groups)

Multi-select or single-select controls that need coordination expose a paired `XxxGroup` that:

- Manages the shared value (`string[]` for Checkbox, `string` for Radio)
- Distributes context (`XxxGroupContext`) so children can read `value`, `disabled`, `size`, `hasError`, `name`
- Renders as `<fieldset>` with an optional `<legend>` for a11y grouping
- Supports both controlled (`value` + `onValueChange`) and uncontrolled (`defaultValue`) usage

**Canonical examples:** `CheckboxGroup`, `RadioGroup`.

When a child inside a group receives its own explicit prop (e.g. `disabled`), the child's prop **wins** over the group's. This is documented in each component's JSDoc.

---

## Design tokens live in `src/tokens/`

Never define a design value (colour, radius, spacing, typography, shadow) inline in a component. Add it to the appropriate file under `src/tokens/`, expose it via `createTokens()` in `src/config/tamagui.config.ts`, and reference it as a `$token` string.

See [DESIGN_TOKENS.md](./DESIGN_TOKENS.md) for the full rule set.

---

## Layer boundaries — what depends on what

```
apps (consumers)
   ↓
src/index.ts (barrel)
   ↓
src/components/*  ────────►  src/tokens/*
   ↓                              ↑
src/config/tamagui.config.ts ─────┘
```

- **Components depend on tokens** — never the other way round.
- **Components do not import from other component folders** unless they are compositions that own the relationship (e.g. `Person` composes `Avatar`). When you find yourself wanting a shared internal helper, promote it to `src/utils/` (add the folder if it does not exist) and document the shared surface.
- **Storybook stories may import cross-component** — they are demos, not library code.
- **`tamagui.config.ts` is the only place `createTamagui()` is called.** Consumers import `tamaguiConfig` from `@peryskop/ui/tamagui.config`.

---

## When you feel the architecture pushing back

That is the signal to stop and think, not to work around it. The pattern was chosen deliberately; if a real requirement genuinely does not fit, discuss it in the PR before writing code that bends the rules. Common false positives:

- "I need shared styles across two components" → add a token or a shared `styled()` in the parent component's `.styles.ts` if they are variants of the same thing; otherwise duplicate — the visual language is more important than DRY.
- "I need to access `window` from a component" → guard with `typeof window !== 'undefined'` and provide a native fallback; see `Textarea` auto-resize as the canonical example.
- "I need a `useEffect` in `.styles.ts`" → wrong layer; the effect belongs in `.tsx`.
