import type { Meta, StoryObj } from '@storybook/react-vite'
import { XStack, YStack, Text } from 'tamagui'
import { shadows } from '../tokens/shadows'

const meta: Meta = {
  title: 'Foundations/Shadows',
  parameters: {
    docs: {
      description: {
        component:
          'Shadow presets from Figma. Apply as spread props: `<View {...shadows.medium} />`. Web gets real `boxShadow` with spread; native approximates via `shadowRadius` + `elevation`.',
      },
    },
  },
}

export default meta
type Story = StoryObj

function ShadowDemo({
  name,
  shadow,
  spec,
}: {
  name: string
  shadow: object
  spec: string
}) {
  return (
    <YStack gap={12} alignItems="center">
      <YStack
        width={160}
        height={120}
        borderRadius={12}
        backgroundColor="$background"
        alignItems="center"
        justifyContent="center"
        {...shadow}
      >
        <Text fontSize={14} fontWeight="600" color="$color">
          {name}
        </Text>
      </YStack>
      <Text fontSize={11} color="$colorMuted">
        {spec}
      </Text>
    </YStack>
  )
}

export const AllShadows: Story = {
  render: () => (
    <XStack gap={48} padding={48} flexWrap="wrap">
      <ShadowDemo name="small" shadow={shadows.small} spec="0 0 8 0" />
      <ShadowDemo name="medium" shadow={shadows.medium} spec="0 1 8 2" />
      <ShadowDemo name="large" shadow={shadows.large} spec="0 1 24 8" />
    </XStack>
  ),
}
