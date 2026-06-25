import { styled, Stack } from 'tamagui'

/**
 * Semantic layout primitives — render proper HTML5 landmarks on web
 * (great for SEO and assistive tech) and plain Views on native.
 */

export const Section = styled(Stack, { name: 'Section', tag: 'section' })
export const Article = styled(Stack, { name: 'Article', tag: 'article' })
export const Header = styled(Stack, { name: 'Header', tag: 'header' })
export const Footer = styled(Stack, { name: 'Footer', tag: 'footer' })
export const Nav = styled(Stack, { name: 'Nav', tag: 'nav' })
export const Main = styled(Stack, { name: 'Main', tag: 'main' })
export const Aside = styled(Stack, { name: 'Aside', tag: 'aside' })

export const List = styled(Stack, { name: 'List', tag: 'ul' })
export const OrderedList = styled(Stack, { name: 'OrderedList', tag: 'ol' })
export const ListItem = styled(Stack, { name: 'ListItem', tag: 'li' })
