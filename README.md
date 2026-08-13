# @fundacja-peryskop/ui

Shared design-system library for **Peryskop**. One component set, three runtimes:

- React 19 on the **web** (via `react-native-web`)
- React Native on **iOS**
- React Native on **Android**

Built on top of [Tamagui](https://tamagui.dev) so every component renders to native primitives on iOS/Android and to semantic HTML (`<article>`, `<h1>`, `<label>`, `<fieldset>`, `<a href>`, …) on the web — SEO- and accessibility-friendly without maintaining two component trees.

Published to **GitHub Packages** under the `@fundacja-peryskop` scope.

---

## Table of contents

- [Install](#install)
- [Setup](#setup)
- [Components](#components)
- [Design tokens](#design-tokens)
- [Documentation](#documentation)
- [Storybook](#storybook)
- [Scripts](#scripts)
- [Contributing](#contributing)

---

## Install

This package lives on **GitHub Packages**, not npmjs.com. Consumers need a GitHub Personal Access Token with `read:packages` scope.

### One-time setup per developer

1. Create a PAT at https://github.com/settings/tokens (classic) with `read:packages` scope only.
2. Export it as an env var:

   ```bash
   # ~/.zshrc, ~/.bashrc, or Windows: setx GITHUB_TOKEN "ghp_..."
   export GITHUB_TOKEN=ghp_your_token_here
   ```

### Per-project setup

Add an `.npmrc` at the root of your consuming project:

```
@fundacja-peryskop:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

The `${GITHUB_TOKEN}` form is safe to commit — npm expands it at install time; the literal token never touches the repo.

### Install

```bash
npm install @fundacja-peryskop/ui
```

### Peer dependencies

Your app must provide these — they are not bundled with the library:

```
react                 >= 18.2
react-dom             (web only)
react-native          (mobile only)
tamagui               >= 1.140
```

Full CI setup and consumer troubleshooting: [docs/PUBLISHING.md](./docs/PUBLISHING.md#installing-the-package).

---

## Setup

### 1. Wrap your app with the provider

```tsx
import { PeryskopProvider } from '@fundacja-peryskop/ui'

export function App({ children }: { children: React.ReactNode }) {
  return <PeryskopProvider defaultTheme="light">{children}</PeryskopProvider>
}
```

### 2. Web bundler (Vite)

Add the Tamagui plugin so styles get extracted to atomic CSS and the bundle stays small:

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { tamaguiPlugin } from '@tamagui/vite-plugin'

export default defineConfig({
  plugins: [
    react(),
    tamaguiPlugin({
      config: './node_modules/@fundacja-peryskop/ui/src/config/tamagui.config.ts',
      components: ['tamagui', '@fundacja-peryskop/ui'],
    }),
  ],
})
```

### 3. Native bundler (Expo / React Native CLI)

Add the Tamagui Babel plugin in `babel.config.js`:

```js
module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    [
      '@tamagui/babel-plugin',
      {
        components: ['tamagui', '@fundacja-peryskop/ui'],
        config: './node_modules/@fundacja-peryskop/ui/src/config/tamagui.config.ts',
      },
    ],
  ],
}
```

### 4. Load the Sarabun font

**Web** — add to `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Sarabun:wght@400;500;700&display=swap"
  rel="stylesheet"
/>
```

**Native (Expo)**:

```tsx
import { useFonts } from 'expo-font'

const [loaded] = useFonts({
  Sarabun: require('./assets/fonts/Sarabun-Regular.ttf'),
  'Sarabun-Medium': require('./assets/fonts/Sarabun-Medium.ttf'),
  'Sarabun-Bold': require('./assets/fonts/Sarabun-Bold.ttf'),
})
if (!loaded) return null
```

---

## Components

Every component is fully typed, accessible, cross-platform, and covered by Storybook stories. Import from the package root:

```tsx
import { Button, Input, Checkbox, Card /* … */ } from '@fundacja-peryskop/ui'
```

### Form controls

| Component   | Purpose                                                                                 |
| ----------- | --------------------------------------------------------------------------------------- |
| `Button`    | Primary CTA. `variant` = primary / secondary / danger / mutedPrimary. Outlined mode.    |
| `Input`     | Single-line text input with label, caption, error, prefix/suffix slots.                 |
| `Textarea`  | Multi-line text input. Auto-resizes to content, capped by `maxRows`.                    |
| `Select`    | Dropdown built on Tamagui's Select primitive. Grouped options, mobile Sheet adaptation. |
| `Checkbox`  | Standalone or grouped (`CheckboxGroup`). Indeterminate state, error, sizes.             |
| `Radio`     | Almost always used inside `RadioGroup`. Native `<fieldset>` + `<legend>` a11y.          |
| `Switch`    | Binary toggle. Animated thumb, sizes sm/md/lg, `labelStart` for iOS-style lists.        |
| `FormGroup` | Vertical wrapper for form fields. Applies consistent spacing + `role="group"`.          |

### Data display

| Component | Purpose                                                                                |
| --------- | -------------------------------------------------------------------------------------- |
| `Card`    | Elevated content container with header / body / footer slots.                          |
| `Chip`    | Compact pill for tags, filters, selectable options. Removable variant with `onDelete`. |
| `Badge`   | Coloured dot + label. Semantic tones: primary / secondary / danger / success / muted.  |
| `Avatar`  | Circular user image with fallback initials. `Avatar.Group` for stacked avatars.        |
| `Person`  | Composite of Avatar + name + role. Common list-row identity primitive.                 |

### Content

| Component    | Purpose                                                                                                                                           |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Article`    | Semantic `<article>` compound: `Article.Banner`, `Article.Content`. Handles `<figure>` margin reset and responsive banner aspect ratio.           |
| `Typography` | Sarabun-based text with 14 variants (title1..3, largeBold..regular, regular*, small*, tiny*). Auto-picks semantic tag on web (`title1` → `<h1>`). |
| `Link`       | Renders `<a href>` on web (crawlable), `Text` on native. `external` prop opens in new tab.                                                        |

### Layout

Semantic HTML5 landmarks on web; plain Views on native:

`Section`, `Header`, `Footer`, `Nav`, `Main`, `Aside`.

```tsx
<Main>
  <Header>
    <Nav>…</Nav>
  </Header>
  <Section>
    <Article>
      <Typography variant="title1">Article title</Typography>
    </Article>
  </Section>
  <Footer>…</Footer>
</Main>
```

### Foundations

Not components, but shipped from the same package:

- `PeryskopProvider` — Tamagui provider wired with our themes and fonts
- `tamaguiConfig` — the underlying `createTamagui()` config, importable for advanced use
- `shadows` — cross-platform shadow presets (`shadows.small`, `shadows.medium`, `shadows.large`)

---

## Design tokens

Reference tokens via Tamagui's `$` notation. Tamagui picks the right scale from the prop's context (`padding` → space, `borderRadius` → radius, `color` → colour).

```tsx
<YStack
  padding="$lg" // 16px
  gap="$sm" // 8px
  borderRadius="$md" // 12px
  backgroundColor="$primarySoft"
/>
```

### Spacing (4-based scale)

`$none` (0), `$xs` (4), `$sm` (8), `$md` (12), `$lg` (16), `$xl` (24), `$xxl` (32), `$xxxl` (48)

### Radius

`$none` (0), `$xs` (4), `$sm` (8), `$md` (12), `$lg` (16), `$full` (9999 — pills, avatars)

### Colours

Semantic tokens (auto-swap on theme change):

`$background`, `$backgroundHover`, `$color`, `$colorMuted`, `$borderColor`, `$primary`, `$primaryHover`, `$primarySoft`, `$primaryText`, `$secondary`, `$danger`, `$dangerSoft`, `$success`, `$overlay`, and more.

Raw palette also available (`$primaryBase`, `$skyLighter`, `$inkDarker`, …) — but prefer semantic tokens so dark-mode support lands for free.

### Shadows

```tsx
import { shadows } from '@fundacja-peryskop/ui'

<Card {...shadows.small} />   // 0 0 8 0
<Card {...shadows.medium} />  // 0 1 8 2
<Card {...shadows.large} />   // 0 1 24 8
```

Full token reference: [docs/DESIGN_TOKENS.md](./docs/DESIGN_TOKENS.md).

---

## Documentation

Contributor documentation lives under [`docs/`](./docs/README.md). Read these before adding or modifying components:

| Document                                                         | Scope                                                                 |
| ---------------------------------------------------------------- | --------------------------------------------------------------------- |
| [docs/README.md](./docs/README.md)                               | Entry point — six non-negotiables + navigation                        |
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)                   | Folder-per-component, layer separation, resolver pattern              |
| [docs/DESIGN_TOKENS.md](./docs/DESIGN_TOKENS.md)                 | Never use raw values; process for adding new tokens                   |
| [docs/CROSS_PLATFORM.md](./docs/CROSS_PLATFORM.md)               | Web + iOS + Android — `tag=""`, `Platform.OS`, SSR, `Adapt` for touch |
| [docs/TAMAGUI_USAGE.md](./docs/TAMAGUI_USAGE.md)                 | Wrap primitives, don't reimplement; `styled()` conventions            |
| [docs/COMPONENT_DEVELOPMENT.md](./docs/COMPONENT_DEVELOPMENT.md) | 11-step workflow from branch to PR + PR checklist                     |
| [docs/CODING_STANDARDS.md](./docs/CODING_STANDARDS.md)           | Comments, naming, TypeScript, hooks, a11y, git conventions            |
| [docs/PUBLISHING.md](./docs/PUBLISHING.md)                       | Cutting a release + installing the package in a consuming app         |

---

## Storybook

Local component catalogue with an interactive controls panel and accessibility audit. Runs on the web via Vite (`react-native-web` renders the same output that Tamagui produces natively).

```bash
npm run storybook          # dev server on http://localhost:6006
npm run build-storybook    # static build to storybook-static/
```

Stack: **Storybook 9** + **Vite builder** + `@tamagui/vite-plugin`. Addons:

- `addon-a11y` — axe-core audit on every story (Accessibility panel)
- `addon-themes` — light/dark toggle in the toolbar
- `addon-docs` — auto-generated MDX pages from prop types

Stories are colocated with components (`Button.tsx` + `Button.stories.tsx`). Story files are excluded from the published tarball.

---

## Scripts

```bash
npm run build             # build dist (cjs + esm) + types via @tamagui/build
npm run watch             # rebuild on change
npm run typecheck         # tsc --noEmit (covers src + .storybook)
npm run lint              # ESLint with --max-warnings=0
npm run lint:fix          # ESLint with --fix
npm run format            # Prettier over the repo
npm run format:check      # Prettier --check for CI
npm run storybook         # Storybook dev server
npm run build-storybook   # static Storybook build
npm run clean             # remove dist/ + types/ + storybook-static/
```

`prepublishOnly` runs typecheck + lint + clean + build automatically — a broken commit cannot be published.

---

## Contributing

This is an internal library for the Peryskop foundation, but the same discipline applies to every contributor (human or AI agent):

1. Read [docs/README.md](./docs/README.md) before touching any file.
2. One component per branch. Name branches `feat/<component>`, `fix/<scope>`, `refactor/<scope>`, `docs/<scope>`.
3. Follow the [11-step workflow](./docs/COMPONENT_DEVELOPMENT.md#the-workflow) — no shortcuts.
4. Every PR must pass typecheck, lint (zero warnings), and land with `Playground` + `AllStates` stories at minimum.
5. Commit messages in English, imperative, no `Co-Authored-By` trailer.

---

## License

Internal / private. All rights reserved to Fundacja Peryskop.
