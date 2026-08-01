import { styled, Stack } from 'tamagui'

/**
 * Semantic layout primitives — render proper HTML5 landmarks on web
 * (great for SEO and assistive tech) and plain Views on native.
 */

export const Section = styled(Stack, { name: 'Section', tag: 'section' })
// NOTE: The <article> landmark primitive is intentionally not exported here —
// use the full <Article> compound component from `components/Article` instead
// (renders `<article>` on web) or `<Section render="article">` if you need
// a bare landmark.
export const Header = styled(Stack, { name: 'Header', tag: 'header' })
export const Footer = styled(Stack, { name: 'Footer', tag: 'footer' })
export const Nav = styled(Stack, { name: 'Nav', tag: 'nav' })
export const Main = styled(Stack, { name: 'Main', tag: 'main' })
export const Aside = styled(Stack, { name: 'Aside', tag: 'aside' })

// NOTE: The `<List>` / `<OrderedList>` / `<ListItem>` primitives previously
// lived here as bare `styled(Stack, { tag: 'ul'/'ol'/'li' })` wrappers. They
// were superseded by the full `<List>` compound component in
// `components/List` which provides styled markers, dividers, interactive
// rows and a shared context. Callers that need bare semantic wrappers can
// still get them via `<Stack tag="ul">` inline.
