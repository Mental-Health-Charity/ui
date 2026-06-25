import type { Meta, StoryObj } from '@storybook/react-vite'
import { XStack, YStack, Text } from 'tamagui'
import { palette } from '../tokens/palette'

const meta: Meta = {
  title: 'Foundations/Colors',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Raw color palette from Figma Variables. Components should reference semantic tokens (`$primary`, `$background`) instead of raw palette entries.',
      },
    },
  },
}

export default meta
type Story = StoryObj

function Swatch({ name, value }: { name: string; value: string }) {
  return (
    <YStack
      width={140}
      borderWidth={1}
      borderColor="$borderColor"
      borderRadius={8}
      overflow="hidden"
    >
      {/* Raw hex value — bypass Tamagui's strict color typing via `style`. */}
      <YStack height={72} style={{ backgroundColor: value }} />
      <YStack padding={8} gap={2}>
        <Text fontSize={12} fontWeight="600" color="$color">
          {name}
        </Text>
        <Text fontSize={11} color="$colorMuted">
          {value}
        </Text>
      </YStack>
    </YStack>
  )
}

function PaletteGroup({
  title,
  shades,
}: {
  title: string
  shades: Record<string, string>
}) {
  return (
    <YStack gap={12}>
      <Text fontSize={18} fontWeight="700" color="$color">
        {title}
      </Text>
      <XStack gap={12} flexWrap="wrap">
        {Object.entries(shades).map(([name, value]) => (
          <Swatch key={name} name={name} value={value} />
        ))}
      </XStack>
    </YStack>
  )
}

export const FullPalette: Story = {
  render: () => (
    <YStack gap={32} padding={24}>
      <PaletteGroup title="Primary (teal)" shades={palette.primary} />
      <PaletteGroup title="Secondary (yellow)" shades={palette.secondary} />
      <PaletteGroup title="Ink (neutrals — text)" shades={palette.ink} />
      <PaletteGroup title="Sky (neutrals — surfaces)" shades={palette.sky} />
      <PaletteGroup title="Red (danger)" shades={palette.red} />
      <PaletteGroup title="Green (success)" shades={palette.green} />
    </YStack>
  ),
}

export const SemanticTokens: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Theme tokens used by components. Switch the theme in the toolbar to see how they re-map.',
      },
    },
  },
  render: () => {
    const tokens: { name: string; preview: 'bg' | 'text' | 'border' }[] = [
      { name: 'background', preview: 'bg' },
      { name: 'backgroundHover', preview: 'bg' },
      { name: 'backgroundPress', preview: 'bg' },
      { name: 'backgroundStrong', preview: 'bg' },
      { name: 'color', preview: 'text' },
      { name: 'colorMuted', preview: 'text' },
      { name: 'colorInverse', preview: 'text' },
      { name: 'placeholderColor', preview: 'text' },
      { name: 'borderColor', preview: 'border' },
      { name: 'borderColorHover', preview: 'border' },
      { name: 'borderColorFocus', preview: 'border' },
      { name: 'primary', preview: 'bg' },
      { name: 'primaryHover', preview: 'bg' },
      { name: 'primarySoft', preview: 'bg' },
      { name: 'secondary', preview: 'bg' },
      { name: 'secondarySoft', preview: 'bg' },
      { name: 'danger', preview: 'bg' },
      { name: 'dangerSoft', preview: 'bg' },
      { name: 'success', preview: 'bg' },
      { name: 'overlay', preview: 'bg' },
    ]

    return (
      <YStack gap={8} padding={24}>
        {tokens.map(({ name, preview }) => (
          <XStack key={name} gap={12} alignItems="center">
            <YStack
              width={80}
              height={32}
              borderRadius={6}
              borderWidth={preview === 'border' ? 2 : 1}
              borderColor={preview === 'border' ? (`$${name}` as never) : '$borderColor'}
              backgroundColor={preview === 'bg' ? (`$${name}` as never) : '$background'}
              alignItems="center"
              justifyContent="center"
            >
              {preview === 'text' && (
                <Text fontSize={12} color={`$${name}` as never}>
                  Aa
                </Text>
              )}
            </YStack>
            <Text fontSize={13} fontWeight="500" color="$color">
              ${name}
            </Text>
          </XStack>
        ))}
      </YStack>
    )
  },
}
