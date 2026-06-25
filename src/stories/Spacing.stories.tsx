import type { Meta, StoryObj } from '@storybook/react-vite'
import { XStack, YStack, Text } from 'tamagui'
import { space } from '../tokens/spacing'

const meta: Meta = {
  title: 'Foundations/Spacing',
  parameters: {
    docs: {
      description: {
        component:
          '4-based spacing scale used for padding, margin and gap. Reference via Tamagui token props: `padding="$lg"`, `gap="$sm"`, etc.',
      },
    },
  },
}

export default meta
type Story = StoryObj

export const Scale: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <YStack gap={12} padding={24}>
      {Object.entries(space).map(([name, value]) => (
        <XStack key={name} alignItems="center" gap={16}>
          <YStack width={60}>
            <Text fontSize={14} fontWeight="600" color="$color">
              ${name}
            </Text>
          </YStack>
          <YStack width={50}>
            <Text fontSize={12} color="$colorMuted">
              {value}px
            </Text>
          </YStack>
          <YStack
            height={20}
            width={value === 0 ? 1 : value}
            backgroundColor="$primary"
            borderRadius={2}
          />
        </XStack>
      ))}
    </YStack>
  ),
}

export const PaddingPreview: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <YStack gap={16} padding={24}>
      <Text fontSize={14} color="$colorMuted">
        Box with `padding="$&lt;token&gt;"`:
      </Text>
      <XStack gap={16} flexWrap="wrap">
        {(Object.keys(space) as Array<keyof typeof space>).map((name) => (
          <YStack key={name} gap={6} alignItems="center">
            <YStack
              backgroundColor="$primarySoft"
              borderColor="$primary"
              borderWidth={1}
              borderRadius="$sm"
              padding={space[name]}
            >
              <YStack
                width={40}
                height={20}
                backgroundColor="$primary"
                borderRadius={2}
              />
            </YStack>
            <Text fontSize={11} color="$colorMuted">
              ${name}
            </Text>
          </YStack>
        ))}
      </XStack>
    </YStack>
  ),
}
