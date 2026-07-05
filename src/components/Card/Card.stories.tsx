import type { Meta, StoryObj } from '@storybook/react-vite'
import { XStack, YStack, Text } from 'tamagui'
import { Card } from './Card'
import { Typography } from '../Typography'
import { Button } from '../Button'
import { Badge } from '../Badge'

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  argTypes: {
    variant: {
      control: 'select',
      options: ['elevated', 'outlined', 'filled', 'plain'],
    },
    hoverable: { control: 'boolean' },
    clickable: { control: 'boolean' },
    disabled: { control: 'boolean' },
    onPress: { action: 'pressed' },
  },
  args: {
    variant: 'elevated',
  },
  decorators: [
    (Story) => (
      <YStack width={360} padding={24}>
        <Story />
      </YStack>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Card>

export const Playground: Story = {
  render: (args) => (
    <Card {...args}>
      <Card.Header>
        <Typography variant="regularSemibold">Team standup</Typography>
        <Typography variant="smallRegular" muted>
          10:00 · Room A
        </Typography>
      </Card.Header>
      <Card.Body>
        <Typography variant="regularRegular">Discuss weekly priorities and blockers.</Typography>
      </Card.Body>
      <Card.Footer>
        <Button variant="mutedPrimary">Cancel</Button>
        <Button>Join</Button>
      </Card.Footer>
    </Card>
  ),
}

export const AllVariants: Story = {
  parameters: { layout: 'fullscreen' },
  decorators: [(S) => <S />],
  render: () => (
    <XStack gap={16} padding={24} flexWrap="wrap">
      {(['elevated', 'outlined', 'filled', 'plain'] as const).map((v) => (
        <YStack key={v} gap={4} width={220}>
          <Text fontSize={12} color="$colorMuted">
            {v}
          </Text>
          <Card variant={v}>
            <Card.Header>
              <Typography variant="regularSemibold">Card title</Typography>
            </Card.Header>
            <Card.Body>
              <Typography variant="smallRegular" muted>
                Supporting body text for this card.
              </Typography>
            </Card.Body>
          </Card>
        </YStack>
      ))}
    </XStack>
  ),
}

export const Clickable: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Providing `onPress` (or `clickable`) turns the card into a keyboard-focusable button surface with a visible focus ring, hover background, and a tactile press-down.',
      },
    },
  },
  render: () => (
    <Card onPress={() => {}}>
      <Card.Header>
        <XStack alignItems="center" gap={8}>
          <Typography variant="regularSemibold">Migration #421</Typography>
          <Badge tone="primary">In progress</Badge>
        </XStack>
        <Typography variant="smallRegular" muted>
          Started 4 minutes ago
        </Typography>
      </Card.Header>
      <Card.Body>
        <Typography variant="smallRegular">Migrating 12,432 rows across 4 tables.</Typography>
      </Card.Body>
    </Card>
  ),
}

export const Hoverable: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Non-clickable card with a subtle hover state — useful when the row is interactive but the click target is elsewhere (e.g. a link inside).',
      },
    },
  },
  render: () => (
    <Card hoverable>
      <Card.Header>
        <Typography variant="regularSemibold">Nightly digest</Typography>
      </Card.Header>
      <Card.Body>
        <Typography variant="smallRegular" muted>
          15 new events since your last visit.
        </Typography>
      </Card.Body>
    </Card>
  ),
}

export const Polymorphic: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Swap the rendered element via Tamagui's `render` prop — string for HTML tag, JSX for elements needing props like `href`.",
      },
    },
  },
  render: () => (
    <YStack gap={12}>
      <Card render="article">
        <Card.Header>
          <Typography variant="regularSemibold">Renders as &lt;article&gt;</Typography>
        </Card.Header>
      </Card>
      {/* Tamagui clones the render element and injects card children as its
          content — the anchor is intentionally empty at declaration time. */}
      {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
      <Card render={<a href="/details" />} hoverable>
        <Card.Header>
          <Typography variant="regularSemibold">
            Renders as &lt;a href&gt; (crawlable link)
          </Typography>
        </Card.Header>
      </Card>
    </YStack>
  ),
}

export const CustomPadding: Story = {
  render: () => (
    <YStack gap={12}>
      <Card padding={0}>
        <Card.Body padding="$lg">
          <Typography>Padding=0 on Card, pushed to Card.Body.</Typography>
        </Card.Body>
      </Card>
      <Card padding="$xl">
        <Card.Header>
          <Typography variant="regularSemibold">Roomy card</Typography>
        </Card.Header>
      </Card>
    </YStack>
  ),
}
