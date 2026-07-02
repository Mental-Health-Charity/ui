import type { Meta, StoryObj } from '@storybook/react-vite'
import { XStack, YStack, Text } from 'tamagui'
import { Button } from './Button'

const VARIANTS = ['primary', 'secondary', 'danger', 'mutedPrimary'] as const

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    variant: { control: 'select', options: VARIANTS },
    outlined: { control: 'boolean' },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    onPress: { action: 'pressed' },
  },
  args: {
    children: 'Button',
    variant: 'primary',
    outlined: false,
    disabled: false,
    fullWidth: false,
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Playground: Story = {}

export const AllVariants: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <YStack gap={24} padding={24}>
      {VARIANTS.map((variant) => (
        <YStack key={variant} gap={8}>
          <Text fontSize={12} fontWeight="600" color="$colorMuted">
            {variant}
          </Text>
          <XStack gap={12} alignItems="center" flexWrap="wrap">
            <Button variant={variant}>Filled</Button>
            <Button variant={variant} outlined>
              Outlined
            </Button>
            <Button variant={variant} disabled>
              Disabled
            </Button>
            <Button variant={variant} outlined disabled>
              Disabled outlined
            </Button>
          </XStack>
        </YStack>
      ))}
    </YStack>
  ),
}

export const FullWidth: Story = {
  args: {
    fullWidth: true,
    children: 'Submit form',
  },
  decorators: [
    (Story) => (
      <YStack width={320} alignSelf="flex-start">
        <Story />
      </YStack>
    ),
  ],
}

export const IconOnly: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'For icon-only buttons, pass `aria-label` so screen readers announce a meaningful name. Works on both web and React Native (RN 0.71+).',
      },
    },
  },
  args: {
    'aria-label': 'Delete item',
    variant: 'danger',
    children: '🗑',
  },
}
