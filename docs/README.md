# Peryskop UI — Contributor Documentation

This directory is the source of truth for **how** to work in this repository. Read it before you write, edit, or refactor any code — the rules here override intuition and generic React/TypeScript conventions.

The audience is any contributor (human or AI agent) about to touch the library.

---

## What this library is

`@fundacja-peryskop/ui` is a shared design-system library that ships components for:

- **Web** — React 19 + `react-native-web` running in the browser
- **Mobile** — React Native on iOS and Android

One codebase per component, one styling API (Tamagui), one design token surface. Every component must work on all three platforms without a platform-specific wrapper unless a runtime capability genuinely differs (this is rare).

---

## The six non-negotiables

1. **Always use design tokens** — colours, radii, spacing, typography. Raw hex, raw pixels, and magic numbers are prohibited when a token exists. If none exists and you need a new value, add it to the token scale rather than inline it. See [DESIGN_TOKENS.md](./DESIGN_TOKENS.md).

2. **Follow the repository architecture** — folder-per-component, styles separated from logic, resolver functions for state variants, semantic theme tokens over raw palette. See [ARCHITECTURE.md](./ARCHITECTURE.md).

3. **Reach for a Tamagui primitive before writing your own** — Select, Sheet, Dialog, Popover, Adapt, RadioGroup, and Switch are already accessible, keyboard-navigable, and cross-platform. Wrap and theme them; do not reimplement them. See [TAMAGUI_USAGE.md](./TAMAGUI_USAGE.md).

4. **Cross-platform first** — never use raw `<div>`, `<button>`, or `window.*` without a guard. Prefer `Stack`, `Text`, `TextInput`, and `styled()` primitives. When you need semantic HTML on web, use `tag=""`. See [CROSS_PLATFORM.md](./CROSS_PLATFORM.md).

5. **Enterprise-grade code quality** — typed strictly, ref-forwarded, accessible, tested against the design system, and lint-clean. See [CODING_STANDARDS.md](./CODING_STANDARDS.md).

6. **Follow the component-development workflow** — plan, branch, structure, verify, commit, PR. Every new component or non-trivial change goes through the same steps. See [COMPONENT_DEVELOPMENT.md](./COMPONENT_DEVELOPMENT.md).

---

## How to navigate this documentation

| Document                                               | When to read                                                              |
| ------------------------------------------------------ | ------------------------------------------------------------------------- |
| [ARCHITECTURE.md](./ARCHITECTURE.md)                   | Before creating any file — repo layout, layers, folder-per-component rule |
| [DESIGN_TOKENS.md](./DESIGN_TOKENS.md)                 | Any time you write a colour, radius, spacing, or typography value         |
| [CROSS_PLATFORM.md](./CROSS_PLATFORM.md)               | Any time you touch DOM APIs, semantic HTML, or platform behaviour         |
| [TAMAGUI_USAGE.md](./TAMAGUI_USAGE.md)                 | Before writing a popover, menu, dialog, dropdown, sheet, tooltip, etc.    |
| [COMPONENT_DEVELOPMENT.md](./COMPONENT_DEVELOPMENT.md) | Whenever you add or substantially change a component                      |
| [CODING_STANDARDS.md](./CODING_STANDARDS.md)           | Continuously — style, comments, TS, a11y, PR checklist                    |
| [PUBLISHING.md](./PUBLISHING.md)                       | Cutting a release, or installing the package in a consuming app           |

---

## Anti-patterns quick reference

The following are cause for a PR to be blocked. This list is not exhaustive; consult the linked documents for the full rule set.

- Hardcoded hex colours (`#ffffff`, `rgba(...)`) in component styles
- Hardcoded radii or spacing when a token exists (`9999`, `8`, `12`, `16`)
- A `<div>`, `<span>`, `<button>`, or `<input>` written directly instead of a Tamagui primitive (with two exceptions: the visually-hidden native inputs behind Checkbox/Radio/Switch, and the semantic-tag override via `tag=""`)
- Rewriting a Tamagui primitive that already exists (`Select`, `Sheet`, `Dialog`, `Popover`, `Adapt`, `RadioGroup`, `Switch`, `Tooltip`, ...)
- Comments in Polish (or any language other than English) in code
- A component without `forwardRef`
- A form field without `useId()`-generated `id` and `aria-describedby`
- A story file that does not include `Playground` and `AllStates`
- A component whose state colours are spread inline at the call site rather than driven by a `resolveXxxState()` resolver + `state` variant

---

## Repository conventions at a glance

- Package manager: `npm` (peer-dependency and override contract lives in `package.json`)
- Node: `>= 20`
- Formatting: Prettier — enforced pre-commit via `lint-staged`
- Linting: ESLint 9 flat config with `typescript-eslint`, `jsx-a11y`, `react-hooks`, `unused-imports`, `storybook` — enforced pre-commit and in CI
- Type checking: `tsc --noEmit`, must pass before commit
- Commits: no `Co-Authored-By: Claude` trailer
- Branches: one feature per branch, named `feat/<component>` or `refactor/<scope>` or `docs/<scope>`
- Commits inside a branch: written imperatively (`add`, `fix`, `refactor`), body explains **why**
