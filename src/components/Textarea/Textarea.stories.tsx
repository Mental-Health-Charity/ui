import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { YStack, Text } from 'tamagui'
import { Textarea } from './Textarea'

const meta: Meta<typeof Textarea> = {
  title: 'Components/Textarea',
  component: Textarea,
  argTypes: {
    label: { control: 'text' },
    caption: { control: 'text' },
    error: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    autoResize: { control: 'boolean' },
    rows: { control: { type: 'number', min: 1, max: 20 } },
    maxRows: { control: { type: 'number', min: 1, max: 40 } },
  },
  args: {
    label: 'Message',
    placeholder: 'Type your message…',
    caption: undefined,
    error: undefined,
    disabled: false,
    autoResize: true,
    rows: 3,
    maxRows: 8,
  },
  decorators: [
    (Story) => (
      <YStack width={480}>
        <Story />
      </YStack>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Textarea>

export const Playground: Story = {}

export const WithCaption: Story = {
  args: {
    caption: 'Markdown is supported.',
  },
}

export const WithErrorMessage: Story = {
  args: {
    error: 'Message can’t be empty.',
  },
}

export const WithErrorFlag: Story = {
  args: { error: true },
}

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'This textarea is read-only.' },
}

export const FixedHeight: Story = {
  args: {
    label: 'Description (fixed 4 rows)',
    rows: 4,
    autoResize: false,
    placeholder:
      'This textarea will not grow with content — it keeps a constant 4-row height and scrolls internally.',
  },
}

export const CappedGrowth: Story = {
  args: {
    label: 'Comment (grows up to 6 rows)',
    rows: 2,
    maxRows: 6,
    defaultValue:
      'Line 1\nLine 2\nLine 3\nLine 4\nLine 5\nLine 6\nLine 7 — this row triggers the internal scrollbar.',
  },
}

// ---------------------------------------------------------------------------
// Controlled
// ---------------------------------------------------------------------------

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <YStack gap={12}>
        <Textarea
          label="Feedback"
          placeholder="Tell us what you think…"
          value={value}
          onChangeText={setValue}
          caption={`${value.length} characters`}
        />
        <Text fontSize={12} color="$colorMuted">
          The parent owns the value and can enforce a length limit externally.
        </Text>
      </YStack>
    )
  },
}

// ---------------------------------------------------------------------------
// Kitchen sink
// ---------------------------------------------------------------------------

export const AllStates: Story = {
  parameters: { layout: 'fullscreen' },
  decorators: [(S) => <S />],
  render: () => (
    <YStack gap={20} padding={24} maxWidth={520}>
      <Textarea label="Default" placeholder="Auto-resizes as you type…" />
      <Textarea
        label="With caption"
        placeholder="Auto-resizes…"
        caption="Grows up to 8 rows, then scrolls."
      />
      <Textarea label="Filled" defaultValue={'One line.\nTwo lines.\nThree lines.'} />
      <Textarea
        label="Error (string)"
        placeholder="Required field"
        error="Please write something."
      />
      <Textarea label="Error (flag only)" placeholder="Border only" error />
      <Textarea label="Disabled" disabled defaultValue="Locked content." />
      <Textarea label="Fixed 5 rows" rows={5} autoResize={false} placeholder="Fixed height" />
    </YStack>
  ),
}
