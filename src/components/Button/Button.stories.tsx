import type { Meta, StoryObj } from '@storybook/react-vite'
import { XStack, YStack, Text } from 'tamagui'
import { Button } from './Button'

const VARIANTS = [
  'primary',
  'secondary',
  'outline',
  'ghost',
  'softPrimary',
  'softSecondary',
  'danger',
  'softDanger',
] as const

const SIZES = ['sm', 'md', 'lg'] as const

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    variant: { control: 'select', options: VARIANTS },
    size: { control: 'select', options: SIZES },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    onPress: { action: 'pressed' },
  },
  args: {
    children: 'Button',
    variant: 'primary',
    size: 'md',
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
            {SIZES.map((size) => (
              <Button key={size} variant={variant} size={size}>
                {`${variant} / ${size}`}
              </Button>
            ))}
            <Button variant={variant} disabled>
              disabled
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
