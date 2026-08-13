# Cross-Platform Development

This library ships to **three runtimes** from one source tree:

| Runtime | Environment                                |
| ------- | ------------------------------------------ |
| Web     | React 19 + `react-native-web` in a browser |
| iOS     | React Native on iOS 15+                    |
| Android | React Native on Android 8+ (API 26+)       |

Every component must work on all three without a per-platform fork, unless a runtime capability genuinely does not exist on one platform (which is rare and always documented).

---

## The mental model

Write React Native first. `react-native-web` maps React Native primitives to DOM equivalents automatically. Tamagui adds a styling layer that compiles to CSS on web and StyleSheet on native. The three-way abstraction means:

- `<Stack>` → `<div>` on web, `<View>` on native
- `<Text>` → `<span>` on web, `<Text>` on native
- `<TextInput>` → `<input>` on web (or `<textarea>` if `multiline`), `<TextInput>` on native
- `<Pressable>` → `<div role="button">` on web, `<Pressable>` on native
- `styled(...)` → generates a CSS class on web, an inline StyleSheet entry on native

The rule of thumb: **if you find yourself importing from `react-dom` or writing a bare HTML tag, stop.** There is almost always a Tamagui or React Native equivalent.

---

## Do use

| Instead of…                                | Use…                                                                                                      |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| `<div>`                                    | `<Stack>` (or a `styled(Stack, { … })` component)                                                         |
| `<span>` / `<p>` / `<h1..h6>`              | `<Text>` (or a `styled(Text, { … })`)                                                                     |
| `<button>`                                 | `styled(Stack, { tag: 'button', role: 'button' })` — see `Button.styles.ts`                               |
| `<input type="text">`                      | `styled(TextInput, { … })` — see `Input.styles.ts`                                                        |
| `<input type="checkbox">`                  | Tamagui `Checkbox` primitive OR a hidden native `<input>` behind a styled visual box (see our `Checkbox`) |
| `<select>`                                 | Tamagui `Select` primitive — never a native `<select>`                                                    |
| `onClick`                                  | `onPress` (works on both platforms)                                                                       |
| `useEffect(() => document.querySelector…)` | `useRef` + `ref` prop; DOM access only inside `typeof window !== 'undefined'` guards                      |
| `window.setTimeout`                        | `setTimeout` (global — works on both)                                                                     |
| `window.getComputedStyle(el)`              | Guard with `typeof window !== 'undefined'` and provide a fallback (see `Textarea` auto-resize)            |

---

## Semantic HTML on web via `tag=""`

Web needs semantic HTML for SEO and screen-reader landmarks (`<article>`, `<header>`, `<label>`, `<fieldset>`, `<legend>`, etc.). React Native has no concept of these tags, and Tamagui handles the discrepancy via the `tag` prop:

```ts
export const ArticleFrame = styled(Stack, {
  name: 'ArticleFrame',
  tag: 'article', // renders <article> on web, <View> on native
  // …
})
```

On native, `tag` is ignored — the component renders as its base primitive (`Stack` → `View`). On web, Tamagui replaces the outer element with the requested tag while keeping the class and props identical.

**Use `tag` for:**

- Semantic sectioning: `article`, `section`, `header`, `nav`, `main`, `aside`, `footer`
- Semantic content: `figure`, `figcaption`, `blockquote`
- Form structure: `label`, `fieldset`, `legend`
- Text hierarchy: `h1`–`h6` on `Text`-based frames

**Do not use `tag` to hack platform-specific behaviour.** If the two platforms need different logic, that is a real cross-platform difference and needs explicit handling (see below).

---

## Platform-specific escape hatches

Rare, but sometimes necessary. Two supported patterns:

### 1. `Platform.OS` at runtime

```ts
import { Platform } from 'react-native'

if (Platform.OS === 'web') {
  // web-only branch
}
```

Use inside a component when the runtime behaviour genuinely differs (e.g. reading `document.body.scrollTop` to detect scroll position on web while iOS uses a scroll ref). Always keep the native fallback functional — never `throw new Error('web only')`.

### 2. Guarded browser APIs

```ts
const isBrowser = typeof window !== 'undefined'
const lineHeight = isBrowser
  ? parseFloat(window.getComputedStyle(node).lineHeight)
  : FALLBACK_LINE_HEIGHT_PX
```

Used when the same value must be computed on both platforms but the source differs. Canonical example: `Textarea` auto-resize measures `scrollHeight` on web and falls back to `rows * FALLBACK_LINE_HEIGHT_PX` when the measurement is unavailable.

### 3. `.web.tsx` / `.native.tsx` file extensions

Metro (React Native's bundler) resolves `Foo.web.tsx` on web and `Foo.native.tsx` on native. Reserve this for truly divergent implementations — e.g. a `FileUpload` where the web version uses `<input type="file">` and the native version opens a document-picker sheet. **Do not use file-extension splits to work around minor styling differences** — that is what tokens and variants are for.

---

## Server-side rendering (web)

Web consumers may render the library in Next.js or another SSR framework. This means:

- `useLayoutEffect` runs only on the client — React warns during SSR. If you need first-paint layout, gate it: `const useIsoEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect`.
- Any `window`, `document`, `navigator` access must be guarded.
- `useId()` (React 19) is SSR-safe — use it rather than a random-string generator.
- Component state may need to be hydration-safe: initialise `useState` deterministically, not from `window.matchMedia` or `localStorage`.

If a component genuinely cannot render server-side (e.g. it depends on measuring the DOM), document that in JSDoc and provide a lazy-loaded / client-only export path.

---

## Mobile-first UX adaptations

Certain interaction patterns need a different presentation on touch devices. Tamagui provides `Adapt` for this — canonical example is our `Select`:

```tsx
<Adapt when="maxMd" platform="touch">
  <Sheet native modal dismissOnSnapToBottom snapPointsMode="fit">
    <Sheet.Frame padding={0}>
      <Adapt.Contents />
    </Sheet.Frame>
    <Sheet.Overlay backgroundColor="$overlay" />
  </Sheet>
</Adapt>
```

At the `md` breakpoint or below **on touch devices**, the popover swaps for a bottom sheet — giving iOS/Android users the picker they expect. Desktop web keeps the floating popover. One codebase, two idiomatic UX.

Reach for `Adapt` + `Sheet` for any component that opens a floating panel on desktop but should be a bottom sheet on mobile (Select, Menu, DateP icker, etc.).

---

## Accessibility across platforms

Web and native have different a11y APIs. Tamagui and React Native normalise the common ground; use the shared props and they map correctly on both:

| Cross-platform prop | Web                | Native                             |
| ------------------- | ------------------ | ---------------------------------- |
| `aria-label`        | `aria-label`       | `accessibilityLabel`               |
| `aria-describedby`  | `aria-describedby` | `accessibilityHint` (partial)      |
| `aria-invalid`      | `aria-invalid`     | (no direct native equivalent)      |
| `role="button"`     | `role="button"`    | `accessibilityRole="button"`       |
| `tabIndex={0}`      | `tabIndex`         | (native handles focus differently) |

**Prefer the `aria-*` names** — Tamagui maps them to `accessibility*` on native automatically. Do not double-set them (writing both `aria-label` and `accessibilityLabel` on the same element is redundant).

---

## Testing your cross-platform component

Every component must be verifiable in Storybook (`npm run storybook`). Storybook runs on web via Vite. This means visual verification on web is the default check.

For native-specific behaviour that Storybook cannot cover, document the expected behaviour in the story description and, if the component is high-risk, add a smoke-test entry to the consuming mobile app before shipping.

Common web/native gotchas to eyeball:

- **Shadow rendering** differs between web (`box-shadow`) and native (`shadowColor/Offset/Opacity/Radius` on iOS, `elevation` on Android — Android is not supported by Tamagui shadow props; keep shadows subtle so their absence on Android is not jarring).
- **Focus outlines** are web-only — do not rely on `outlineWidth` for native focus feedback; use `focusStyle` instead which works cross-platform.
- **Text rendering** differs slightly for line height and letter spacing — always test long strings and truncation.
- **Absolute positioning** inside `overflow: hidden` behaves differently on iOS — prefer explicit width/height over reliance on shrink-to-fit.
