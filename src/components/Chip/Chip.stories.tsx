import type { Meta, StoryObj } from '@storybook/react-vite'
import { XStack, YStack, Text } from 'tamagui'
import { Chip } from './Chip'

const COLORS = ['default', 'primary', 'secondary', 'danger', 'success', 'muted'] as const

const SIZES = ['sm', 'md', 'lg'] as const

const meta: Meta<typeof Chip> = {
  title: 'Components/Chip',
  component: Chip,
  argTypes: {
    color: { control: 'select', options: COLORS },
    variant: { control: 'select', options: ['filled', 'outlined'] },
    size: { control: 'select', options: SIZES },
    disabled: { control: 'boolean' },
    onPress: { action: 'pressed' },
    onDelete: { action: 'deleted' },
  },
  args: {
    children: 'Chip',
    color: 'default',
    variant: 'filled',
    size: 'md',
  },
}

export default meta
type Story = StoryObj<typeof Chip>

export const Playground: Story = {}

export const AllColors: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <YStack gap={20} padding={24}>
      {(['filled', 'outlined'] as const).map((variant) => (
        <YStack key={variant} gap={8}>
          <Text fontSize={12} fontWeight="600" color="$colorMuted">
            {variant}
          </Text>
          <XStack gap={8} flexWrap="wrap">
            {COLORS.map((color) => (
              <Chip key={color} color={color} variant={variant}>
                {color}
              </Chip>
            ))}
          </XStack>
        </YStack>
      ))}
    </YStack>
  ),
}

export const Sizes: Story = {
  render: () => (
    <XStack gap={12} padding={24} alignItems="center">
      {SIZES.map((size) => (
        <Chip key={size} color="primary" size={size}>
          {size}
        </Chip>
      ))}
    </XStack>
  ),
}

export const WithStartIcon: Story = {
  args: {
    color: 'primary',
    startIcon: <Text color="$primaryText">●</Text>,
    children: 'With icon',
  },
}

export const Deletable: Story = {
  args: {
    color: 'primary',
    children: 'Removable',
    onDelete: () => {},
  },
  parameters: {
    docs: {
      description: {
        story:
          "`onDelete` swaps `endIcon` for a focusable × button. The delete click is stopped from bubbling to the chip's `onPress`, so the two are independent.",
      },
    },
  },
}

export const Clickable: Story = {
  args: {
    color: 'muted',
    children: 'Clickable filter',
    onPress: () => {},
  },
  parameters: {
    docs: {
      description: {
        story:
          'When `onPress` is provided, the chip becomes keyboard-focusable with `role="button"`, a visible focus ring, and a press animation.',
      },
    },
  },
}

export const Disabled: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <XStack gap={12} padding={24} flexWrap="wrap">
      <Chip disabled>Static disabled</Chip>
      <Chip disabled onPress={() => {}}>
        Clickable disabled
      </Chip>
      <Chip disabled onDelete={() => {}}>
        Deletable disabled
      </Chip>
    </XStack>
  ),
}
