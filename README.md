# @peryskop/ui

Shared UI library for **Peryskop** — one component set used by:

- the React Native mobile app
- the React web app (CSR / Vite / whatever bundler)

Built on top of [Tamagui](https://tamagui.dev) so the same component renders to:

- **native primitives** (`Text`, `View`, `Pressable`) on iOS / Android
- **semantic HTML** (`<h1>`, `<p>`, `<a href>`, `<nav>`, `<section>`, …) on web

…which is what makes the web build SEO- and accessibility-friendly without
maintaining two component trees.

---

## Install

This package is not published yet — link it locally via your monorepo /
workspaces tooling, or `npm pack` + install the tarball.

Peer deps your app must provide:

```
react        >= 18.2
tamagui      ^1.112
react-native *           # only for the mobile app
```

---

## Project structure

```
src/
├── config/                # app-integration: Tamagui config + Provider
│   ├── tamagui.config.ts
│   ├── Provider.tsx
│   └── index.ts
│
├── tokens/                # design tokens (no React, no stories)
│   ├── palette.ts         # raw color palette + flat tokens
│   ├── themes.ts          # semantic light/dark themes
│   ├── typography.ts      # Sarabun font + size/weight scales
│   ├── shadows.ts         # cross-platform shadow presets
│   ├── spacing.ts         # space + radius scales
│   └── index.ts
│
├── components/            # full UI components — folder per component
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.stories.tsx
│   │   └── index.ts
│   ├── Link/
│   ├── Typography/
│   └── Layout/            # semantic HTML5 landmarks
│
├── stories/               # foundation stories (no component owner)
│   ├── Colors.stories.tsx
│   ├── Spacing.stories.tsx
│   ├── Radius.stories.tsx
│   └── Shadows.stories.tsx
│
└── index.ts               # public barrel
```

Convention: any new component → its own folder under `components/`,
shipped with its `.stories.tsx` and a barrel `index.ts`.

## Setup in a consuming app

Wrap your app once with `PeryskopProvider`:

```tsx
import { PeryskopProvider } from '@peryskop/ui'

export function App({ children }: { children: React.ReactNode }) {
  return <PeryskopProvider defaultTheme="light">{children}</PeryskopProvider>
}
```

### Web build (Vite / Webpack)

Add the Tamagui compiler so styles get extracted to atomic CSS and the
bundle stays small:

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { tamaguiPlugin } from '@tamagui/vite-plugin'

export default defineConfig({
  plugins: [
    react(),
    tamaguiPlugin({
      config: './node_modules/@peryskop/ui/src/tamagui.config.ts',
      components: ['tamagui', '@peryskop/ui'],
    }),
  ],
})
```

### Native build (Expo / RN CLI)

Add the Babel plugin in `babel.config.js`:

```js
module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    [
      '@tamagui/babel-plugin',
      {
        components: ['tamagui', '@peryskop/ui'],
        config: './node_modules/@peryskop/ui/src/tamagui.config.ts',
      },
    ],
  ],
}
```

---

## Components

### `Typography`

Mapuje się 1:1 na Figma Font Variables. Konwencja Figmy: `<size>/<weight>`,
w TS bez slasha → `largeBold`, `regularSemibold`, itp.

Web: variant dobiera semantyczny tag (`title1` → `<h1>`, `regularRegular` → `<p>`, `tinyRegular` → `<span>`).

```tsx
<Typography variant="title1">Tytuł strony</Typography>
<Typography variant="regularRegular">Lorem ipsum…</Typography>
<Typography variant="smallSemibold" muted>Pomocniczy tekst</Typography>

// override semantyki niezależnie od wyglądu:
<Typography variant="title1" tag="span">Looks big, not a heading</Typography>
```

Dostępne warianty (Sarabun, weight: Regular=400 / Medium=500 / Bold=700):
- `title1` 48/56, `title2` 32/36, `title3` 24/32 (always bold)
- `largeBold`, `largeSemibold`, `largeRegular` (18/23)
- `regularBold`, `regularSemibold`, `regularRegular` (16/21) — default
- `smallBold`, `smallSemibold`, `smallRegular` (14/20)
- `tinyBold`, `tinySemibold`, `tinyRegular` (12/16)

**Uwaga**: `semibold` = weight `500` (Medium), nie 600. Tak jest w Figmie — patrz `src/tokens/typography.ts`.

#### Loading Sarabun

**Web** (np. w `index.html`):
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@400;500;700&display=swap" rel="stylesheet">
```

**Native (Expo)**:
```tsx
import { useFonts } from 'expo-font'

const [loaded] = useFonts({
  'Sarabun': require('./assets/fonts/Sarabun-Regular.ttf'),
  'Sarabun-Medium': require('./assets/fonts/Sarabun-Medium.ttf'),
  'Sarabun-Bold': require('./assets/fonts/Sarabun-Bold.ttf'),
})
if (!loaded) return null
```

### `Button`

Renders a real `<button>` on web — focusable, Enter/Space activation,
announced as button by screen readers. On native it's a press-handling Stack.

```tsx
<Button variant="primary" onPress={() => doThing()}>Zapisz</Button>
<Button variant="outline" size="sm">Anuluj</Button>
<Button variant="danger" disabled>Usuń</Button>
```

### `Link`

Renders `<a href>` on web (crawlable by Googlebot). On native it's a `Text`
that you wire to `Linking.openURL` or your navigation library.

```tsx
<Link href="/o-nas">O nas</Link>
<Link href="https://example.com" external>Strona zewnętrzna</Link>
```

### Layout primitives

Semantic HTML5 landmarks on web; plain Views on native.

```tsx
<Main>
  <Header><Nav>…</Nav></Header>
  <Section>
    <Article>
      <Typography variant="h1">Tytuł artykułu</Typography>
      …
    </Article>
  </Section>
  <Footer>…</Footer>
</Main>
```

Includes: `Section`, `Article`, `Header`, `Footer`, `Nav`, `Main`, `Aside`,
`List`, `OrderedList`, `ListItem`.

### Spacing & Radius

Skala spacingu (4-base) i corner radius dostępne jako Tamagui tokens.
Referuj przez `$` notację — Tamagui sam wybiera właściwą tabelę z kontekstu propa.

```tsx
<YStack
  padding="$lg"      // 16px
  gap="$sm"          // 8px
  borderRadius="$md" // 12px
/>
```

**Spacing**: `none` (0), `xs` (4), `sm` (8), `md` (12), `lg` (16), `xl` (24), `xxl` (32), `xxxl` (48).
**Radius**: `none` (0), `sm` (8), `md` (12), `lg` (16) — z Figmy + `full` (9999) dla pill/avatarów.

### Shadows

Cross-platform shadow presety z Figmy. Aplikuj jako prop spread:

```tsx
import { shadows } from '@peryskop/ui'

<Card {...shadows.small} />   // 0 0 8 0
<Card {...shadows.medium} />  // 0 1 8 2
<Card {...shadows.large} />   // 0 1 24 8
```

Web: prawdziwy `boxShadow` (ze spreadem). Native: aproksymacja przez
`shadowRadius` + `elevation` (RN nie ma `spread`).

---

## SEO checklist for the web app

The library gives you semantic DOM out of the box. The app still needs to:

1. Manage `<head>` (title, meta description, OG tags) — use
   `@unhead/react` or `react-helmet-async`.
2. Render exactly **one** `<h1>` per page and keep heading order sane.
3. Use real `<a href>` for every navigable link (`Link` component does this).
4. Add a `sitemap.xml` and `robots.txt`.
5. Without SSR, Googlebot will still index the SPA, but ranking and social
   previews are weaker. If SEO becomes critical, swap the web app to Vike /
   Astro / Next.js — the components don't change.

---

## Storybook

Lokalny katalog komponentów (na webie — Tamagui przez `react-native-web` renderuje to samo co RN robi natywnie):

```
pnpm storybook         # dev server na http://localhost:6006
pnpm build-storybook   # statyczny build do storybook-static/
```

Stack: **Storybook 9** + **Vite builder** + `@tamagui/vite-plugin`. Addony:
- `addon-a11y` — axe-core audit każdego story (panel "Accessibility")
- `addon-themes` — przełącznik light/dark w toolbarze (mapuje na `PeryskopProvider defaultTheme`)
- `addon-docs` — auto-generowane MDX z propsami komponentów

Stories są **kolokowane** z komponentami (`Button.tsx` + `Button.stories.tsx`).
Pliki `*.stories.tsx` i `.storybook/` są wyłączone z paczki npm przez `.npmignore`.

Sarabun ładowany jest w `.storybook/preview.css` z Google Fonts.

## Scripts

```
pnpm build             # build dist (cjs + esm + d.ts) via @tamagui/build
pnpm watch             # rebuild on change
pnpm typecheck         # tsc --noEmit (covers src + .storybook)
pnpm storybook         # storybook dev server
pnpm build-storybook   # static storybook build
pnpm clean             # remove dist + storybook-static
```
