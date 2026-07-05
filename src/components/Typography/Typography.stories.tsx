import type { Meta, StoryObj } from '@storybook/react-vite'
import { YStack } from 'tamagui'
import { Typography } from './Typography'

const VARIANTS = [
  'title1',
  'title2',
  'title3',
  'largeBold',
  'largeSemibold',
  'largeRegular',
  'regularBold',
  'regularSemibold',
  'regularRegular',
  'smallBold',
  'smallSemibold',
  'smallRegular',
  'tinyBold',
  'tinySemibold',
  'tinyRegular',
] as const

const meta: Meta<typeof Typography> = {
  title: 'Foundations/Typography',
  component: Typography,
  argTypes: {
    variant: { control: 'select', options: VARIANTS },
    muted: { control: 'boolean' },
    align: { control: 'select', options: ['left', 'center', 'right'] },
    tag: {
      control: 'select',
      options: [undefined, 'h1', 'h2', 'h3', 'h4', 'p', 'span', 'label'],
    },
  },
  args: {
    children: 'The quick brown fox jumps over the lazy dog',
  },
}

export default meta
type Story = StoryObj<typeof Typography>

export const Playground: Story = {
  args: {
    variant: 'regularRegular',
  },
}

export const AllVariants: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <YStack gap={16} padding={24}>
      {VARIANTS.map((variant) => (
        <YStack key={variant} gap={2}>
          <Typography variant="tinyRegular" muted>
            {variant}
          </Typography>
          <Typography variant={variant}>The quick brown fox jumps over the lazy dog</Typography>
        </YStack>
      ))}
    </YStack>
  ),
}

export const SemanticTagOverride: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'On web, `variant` picks the semantic tag automatically (title1 → `<h1>`). Use `tag` to override when the look should not imply that semantic role — e.g. a hero text that visually looks like a heading but is not a document heading.',
      },
    },
  },
  render: () => (
    <YStack gap={24} padding={24}>
      <YStack gap={4}>
        <Typography variant="tinyRegular" muted>
          variant="title1" (renders &lt;h1&gt;)
        </Typography>
        <Typography variant="title1">Page heading</Typography>
      </YStack>
      <YStack gap={4}>
        <Typography variant="tinyRegular" muted>
          variant="title1" tag="span" (visual only, no heading semantics)
        </Typography>
        <Typography variant="title1" tag="span">
          Big visual label
        </Typography>
      </YStack>
    </YStack>
  ),
}

export const Muted: Story = {
  args: {
    variant: 'regularRegular',
    muted: true,
    children: 'Helper / supporting text uses `muted` to drop the opacity / color.',
  },
}
