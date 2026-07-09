import type { Meta, StoryObj } from '@storybook/react-vite'
import { Text } from 'tamagui'
import { Section, Header, Footer, Nav, Main, Aside, List, OrderedList, ListItem } from './Layout'
import { Typography } from '../Typography'

const meta: Meta = {
  title: 'Components/Layout',
  parameters: {
    docs: {
      description: {
        component:
          'Semantic HTML5 landmark primitives. On web they render real `<section>`, `<nav>`, `<header>` etc. — great for SEO and assistive tech. On native they collapse to plain `View`s.',
      },
    },
  },
}

export default meta
type Story = StoryObj

function Box({ label, children }: { label: string; children?: React.ReactNode }) {
  return (
    <>
      <Text fontSize={11} fontWeight="600" color="$colorMuted">
        {label}
      </Text>
      {children}
    </>
  )
}

export const PageStructure: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <Main padding="$lg" gap="$lg" borderWidth={1} borderColor="$borderColor" borderRadius="$md">
      <Box label="<main>" />
      <Header padding="$md" backgroundColor="$primarySoft" borderRadius="$sm" gap="$sm">
        <Box label="<header>" />
        <Nav padding="$sm" backgroundColor="$background" borderRadius="$sm">
          <Box label="<nav>" />
          <Typography variant="regularSemibold">Site navigation</Typography>
        </Nav>
      </Header>

      <Section padding="$md" borderWidth={1} borderColor="$borderColor" borderRadius="$sm">
        <Box label="<section>" />
        <Section padding="$sm" gap="$sm" tag="article">
          <Box label="<article>" />
          <Typography variant="title3">Article title</Typography>
          <Typography variant="regularRegular">Article body content.</Typography>
        </Section>
      </Section>

      <Aside padding="$md" backgroundColor="$secondarySoft" borderRadius="$sm">
        <Box label="<aside>" />
        <Typography variant="smallRegular">Sidebar / supplementary info</Typography>
      </Aside>

      <Footer padding="$md" backgroundColor="$backgroundStrong" borderRadius="$sm">
        <Box label="<footer>" />
        <Typography variant="tinyRegular" muted>
          © 2026 Peryskop
        </Typography>
      </Footer>
    </Main>
  ),
}

export const Lists: Story = {
  render: () => (
    <Main padding="$lg" gap="$lg">
      <Section gap="$sm">
        <Typography variant="regularSemibold">Unordered list (&lt;ul&gt;)</Typography>
        <List paddingLeft="$lg">
          <ListItem>
            <Typography variant="regularRegular">First item</Typography>
          </ListItem>
          <ListItem>
            <Typography variant="regularRegular">Second item</Typography>
          </ListItem>
          <ListItem>
            <Typography variant="regularRegular">Third item</Typography>
          </ListItem>
        </List>
      </Section>

      <Section gap="$sm">
        <Typography variant="regularSemibold">Ordered list (&lt;ol&gt;)</Typography>
        <OrderedList paddingLeft="$lg">
          <ListItem>
            <Typography variant="regularRegular">Step one</Typography>
          </ListItem>
          <ListItem>
            <Typography variant="regularRegular">Step two</Typography>
          </ListItem>
          <ListItem>
            <Typography variant="regularRegular">Step three</Typography>
          </ListItem>
        </OrderedList>
      </Section>
    </Main>
  ),
}
