# Design Tokens

Every visual value in this library must reference a design token. Raw hex, raw pixels, and magic numbers in component styles are prohibited. This document describes the token surface, how to reference it, and when — rarely — to extend it.

---

## The rule

> **If a token exists for the value you need, use the token. If none exists, add a token before you use the value.**

This is a hard rule. A PR that introduces `borderRadius: 8` when `'$sm'` resolves to `8` will be rejected. A PR that hardcodes `'#06b7a7'` when `'$primary'` maps to the same colour will be rejected. There is no "just for this one case" — that is how token drift begins.

---

## Where tokens live

All tokens are defined under `src/tokens/` and wired into Tamagui in `src/config/tamagui.config.ts`. Once wired, they are addressable as `'$tokenName'` strings from any styled component or inline prop.

| File            | Contents                                                                |
| --------------- | ----------------------------------------------------------------------- |
| `palette.ts`    | Raw hex values from Figma + flattened `colorTokens` map                 |
| `themes.ts`     | Semantic `light` and `dark` theme mappings (`background`, `primary`, …) |
| `spacing.ts`    | `radius` and `space` scales                                             |
| `typography.ts` | Sarabun font families and font sizes                                    |
| `shadows.ts`    | Shadow presets                                                          |

---

## Token categories

### 1. Colours

Two layers exist, and **components must almost always use the semantic layer.**

**Semantic layer — `themes.ts`.** Reference these:

```ts
'$background' // page bg / card bg
'$backgroundHover' // hovered surface
'$backgroundStrong' // subtle placeholder / selected item
'$color' // primary text
'$colorMuted' // secondary text
'$borderColor' // default border
'$borderColorFocus' // focus outline
'$primary' // brand primary — teal
'$primaryHover'
'$primarySoft' // ghost / chip background
'$primaryText' // text on primary bg
'$secondary' // brand secondary — yellow
;('$danger', '$dangerHover', '$dangerSoft', '$dangerText')
;('$success', '$successSoft', '$successText')
;('$overlay') // modal/dialog backdrop
```

Semantic tokens automatically switch on theme (light/dark). Using them means dark-mode support falls out of the theme file, not out of every component.

**Raw palette layer — `palette.ts`.** These flatten Figma variables into `'$skyLighter'`, `'$inkDarker'`, `'$primaryBase'`, etc. Use them only when:

- The semantic layer genuinely has no matching entry (rare)
- You are defining a new semantic token in `themes.ts` (the theme file is the only place that references the raw palette)

**Anti-pattern:**

```ts
// ✗ Wrong — raw hex
backgroundColor: '#06b7a7',

// ✗ Wrong — palette when semantic exists
backgroundColor: '$primaryBase',  // use $primary

// ✓ Correct
backgroundColor: '$primary',
```

### 2. Corner radius

Defined in `src/tokens/spacing.ts`:

| Token     | Value | Use for                                   |
| --------- | ----- | ----------------------------------------- |
| `'$none'` | 0     | Flat corners                              |
| `'$xs'`   | 4     | Micro controls — checkbox box, tight tags |
| `'$sm'`   | 8     | Inputs, cards, buttons, popovers          |
| `'$md'`   | 12    | Buttons (default)                         |
| `'$lg'`   | 16    | Large cards, banners                      |
| `'$full'` | 9999  | Pills, avatars, radio/switch tracks       |

Any raw radius value that matches one of these must be replaced with the token.

### 3. Spacing (padding / margin / gap)

Defined in `src/tokens/spacing.ts`:

| Token     | Value | Typical use                     |
| --------- | ----- | ------------------------------- |
| `'$none'` | 0     |                                 |
| `'$xs'`   | 4     | Tight inline gaps               |
| `'$sm'`   | 8     | Icon–label gaps, small paddings |
| `'$md'`   | 12    | Standard content padding        |
| `'$lg'`   | 16    | Section rhythm                  |
| `'$xl'`   | 24    | Page section margins            |
| `'$xxl'`  | 32    | Large gutters                   |
| `'$xxxl'` | 48    | Hero-level spacing              |

For values that fall between tokens (e.g. `10px`), first ask whether the design genuinely needs it. If yes, use the raw number with a `//` comment explaining why it is not on the scale. Do not add micro-scale tokens without a repeated design need across at least three components.

### 4. Typography

Body font is Sarabun, wired via `sarabunFont` in `src/tokens/typography.ts`. Component styles reference `fontFamily: '$body'` — never a raw string.

Font sizes and line heights are currently expressed as raw numbers because the design system has not yet delivered a size scale. When it does, they will move to tokens; components should track that change.

### 5. Shadows

Defined in `src/tokens/shadows.ts`. Use `shadowColor: '$shadowColor'` and pair with `shadowOffset` / `shadowOpacity` / `shadowRadius` values from the design spec.

---

## How to reference a token in code

Tamagui accepts token strings anywhere a value is expected:

```ts
export const InputContainer = styled(Stack, {
  height: 40, // raw pixel — no size token yet
  borderRadius: '$sm', // token
  borderWidth: 1, // raw — 1px hairline, not a design decision
  backgroundColor: '$skyLighter', // token (palette — semantic 'inputBg' would be better)
  paddingHorizontal: '$md', // token
})
```

Rules of thumb:

- Hairline widths (`1`, `1.5`, `2`) are not design tokens — leave as raw.
- One-off pixel geometry inside a specific component (a `topOffset` of `2` for a switch thumb) is not a token — leave as raw.
- Any value that appears in the Figma variables collection is a token — reference it.

---

## Adding a new token

Adding a token is a design-system decision, not a component decision. Follow this process:

1. **Confirm the need.** Is the value used in three or more places, or is it referenced in the Figma design tokens sheet?
2. **Pick the right file.** Radius → `spacing.ts`. Colour → `palette.ts` + a semantic entry in `themes.ts` (both light and dark). Shadow → `shadows.ts`. Space → `spacing.ts`.
3. **Add the entry.** Keep the existing order: alphabetical within the shade family for colours, ascending numeric order for scales.
4. **Verify `tamagui.config.ts` picks it up.** For colours this happens through `createTokens({ color: colorTokens })`; for radius/space it happens through the scale spread. Run `npx tsc --noEmit` — if the token appears in autocomplete on a `$token` prop, wiring is correct.
5. **Migrate existing raw uses.** If you added `radius.xs = 4` because a component needed it, search the codebase for `borderRadius: 4` and migrate the other call sites in the same PR (or explicitly note them for follow-up).
6. **Document the addition.** Update the tables in this file so future contributors see the addition.

**Never** add a token you use only once. That is not a token — it is inlined data with extra indirection.

---

## Anti-patterns to watch for

- Copying a value between components without extracting a token first.
- Adding a `'$brandPurple'` semantic token when no purple exists in the palette — semantic tokens are references, not new values.
- Adding a token only in `themes.light` and forgetting `themes.dark`.
- Using a raw palette token (`'$primaryBase'`) in a component when a semantic token (`'$primary'`) exists.
- Adding a "shortcut" export like `export const RADIUS_SM = 8` — this bypasses Tamagui's token surface and defeats the point.
