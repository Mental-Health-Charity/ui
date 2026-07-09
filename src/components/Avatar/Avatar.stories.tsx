import type { Meta, StoryObj } from '@storybook/react-vite'
import { XStack, YStack, Text } from 'tamagui'
import { Avatar } from './Avatar'

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  args: {
    name: 'Joe Doe',
    size: 32,
  },
}

export default meta
type Story = StoryObj<typeof Avatar>

// Real-photo preview so stories match how the component looks in production
// (with an actual portrait rather than an initials-shaped placeholder).
const sampleSrc =
  'https://img.magnific.com/free-photo/portrait-white-man-isolated_53876-40306.jpg?semt=ais_hybrid&w=740&q=80'

export const Playground: Story = {
  render: (args) => <Avatar {...args} src={sampleSrc} />,
}

export const InitialFallback: Story = {
  render: () => (
    <XStack gap={12} padding={24} alignItems="center">
      <Avatar name="Joe Doe" />
      <Avatar name="Alice" />
      <Avatar name="Marie Curie" />
      <Avatar />
    </XStack>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'When no `src` is given (or the image fails to load) the avatar shows initials derived from `name`. Empty when `name` is missing.',
      },
    },
  },
}

export const Sizes: Story = {
  render: () => (
    <XStack gap={12} padding={24} alignItems="center">
      {[24, 32, 40, 48, 64].map((size) => (
        <YStack key={size} gap={4} alignItems="center">
          <Avatar name="Joe Doe" src={sampleSrc} size={size} />
          <Text fontSize={11} color="$colorMuted">
            {size}px
          </Text>
        </YStack>
      ))}
    </XStack>
  ),
}

export const CustomFallback: Story = {
  render: () => (
    <Avatar
      name="Anonymous user"
      fallback={
        <Text fontSize={16} color="$inkLight">
          ?
        </Text>
      }
    />
  ),
}

export const ImageError: Story = {
  render: () => <Avatar name="Broken image" src="https://example.invalid/does-not-exist.jpg" />,
  parameters: {
    docs: {
      description: {
        story:
          'If the image fails to load, the avatar transparently falls back to initials — no error surfaces to the consumer.',
      },
    },
  },
}

export const Group: Story = {
  render: () => (
    <YStack gap={16} padding={24}>
      <Avatar.Group>
        <Avatar src={sampleSrc} name="Joe Doe" />
        <Avatar name="Alice" />
        <Avatar name="Bob Smith" />
      </Avatar.Group>

      <Avatar.Group max={3}>
        <Avatar src={sampleSrc} name="Joe Doe" />
        <Avatar name="Alice" />
        <Avatar name="Bob Smith" />
        <Avatar name="Marie Curie" />
        <Avatar name="Nikola Tesla" />
      </Avatar.Group>

      <Avatar.Group size={40} spacing={10}>
        <Avatar name="Joe Doe" />
        <Avatar name="Alice" />
        <Avatar name="Bob" />
      </Avatar.Group>
    </YStack>
  ),
}
