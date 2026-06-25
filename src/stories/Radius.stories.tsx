import type { Meta, StoryObj } from '@storybook/react-vite'
import { XStack, YStack, Text } from 'tamagui'
import { radius } from '../tokens/spacing'

const meta: Meta = {
  title: 'Foundations/Radius',
  parameters: {
    docs: {
      description: {
        component:
          'Corner radius scale. Figma uses 8 / 12 / 16; `none` and `full` are added for flat corners and pills/avatars. Reference via Tamagui token: `borderRadius="$md"`.',
      },
    },
  },
}

export default meta
type Story = StoryObj

export const Scale: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <XStack gap={24} padding={24} flexWrap="wrap" alignItems="flex-end">
      {Object.entries(radius).map(([name, value]) => (
        <YStack key={name} gap={8} alignItems="center">
          <YStack
            width={96}
            height={96}
            backgroundColor="$primary"
            borderRadius={value}
          />
          <Text fontSize={13} fontWeight="600" color="$color">
            ${name}
          </Text>
          <Text fontSize={11} color="$colorMuted">
            {value === 9999 ? '9999 (pill)' : `${value}px`}
          </Text>
        </YStack>
      ))}
    </XStack>
  ),
}
