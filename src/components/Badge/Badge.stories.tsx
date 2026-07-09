import type { Meta, StoryObj } from '@storybook/react-vite'
import { XStack, YStack, Text } from 'tamagui'
import { Badge } from './Badge'

const TONES = ['default', 'primary', 'secondary', 'danger', 'success', 'muted'] as const

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  argTypes: {
    tone: { control: 'select', options: TONES },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    dotColor: { control: 'text' },
  },
  args: {
    children: 'Status',
    tone: 'success',
    size: 'md',
  },
}

export default meta
type Story = StoryObj<typeof Badge>

export const Playground: Story = {}

export const AllTones: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <YStack gap={12} padding={24}>
      {TONES.map((tone) => (
        <XStack key={tone} gap={16} alignItems="center">
          <Text width={80} fontSize={12} color="$colorMuted">
            {tone}
          </Text>
          <Badge tone={tone}>Some status</Badge>
        </XStack>
      ))}
    </YStack>
  ),
}

export const Sizes: Story = {
  render: () => (
    <YStack gap={12} padding={24}>
      <Badge tone="success" size="sm">
        Small
      </Badge>
      <Badge tone="success" size="md">
        Medium
      </Badge>
      <Badge tone="success" size="lg">
        Large
      </Badge>
    </YStack>
  ),
}

export const CustomDotColor: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`dotColor` accepts any Tamagui token or raw CSS color — useful when categories carry brand colours outside the semantic palette.',
      },
    },
  },
  render: () => (
    <YStack gap={12} padding={24}>
      <Badge dotColor="$greenLighter">Category: Nature</Badge>
      <Badge dotColor="$secondaryBase">Category: Finance</Badge>
      <Badge dotColor="#9333ea">Category: Custom hex</Badge>
    </YStack>
  ),
}

export const InListRow: Story = {
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'How Badge typically appears in table rows / list items.',
      },
    },
  },
  render: () => (
    <YStack gap={0} padding={24}>
      {[
        { name: 'API server', tone: 'success', label: 'Healthy' },
        { name: 'Web worker', tone: 'success', label: 'Healthy' },
        { name: 'Migration', tone: 'primary', label: 'In progress' },
        { name: 'Nightly job', tone: 'danger', label: 'Failed' },
        { name: 'Backup', tone: 'muted', label: 'Idle' },
      ].map((row) => (
        <XStack
          key={row.name}
          gap={16}
          paddingVertical={8}
          borderBottomWidth={1}
          borderBottomColor="$borderColor"
          alignItems="center"
        >
          <Text width={140}>{row.name}</Text>
          <Badge tone={row.tone as never}>{row.label}</Badge>
        </XStack>
      ))}
    </YStack>
  ),
}
