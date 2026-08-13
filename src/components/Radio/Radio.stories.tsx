import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { YStack, Text } from 'tamagui'
import { Radio, RadioGroup } from './Radio'

const meta: Meta<typeof RadioGroup> = {
  title: 'Components/Radio',
  component: RadioGroup,
  argTypes: {
    label: { control: 'text' },
    caption: { control: 'text' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
    orientation: { control: 'inline-radio', options: ['column', 'row'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
  args: {
    label: 'Delivery method',
    caption: undefined,
    error: undefined,
    disabled: false,
    orientation: 'column',
    size: 'md',
  },
  decorators: [
    (Story) => (
      <YStack width={360}>
        <Story />
      </YStack>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof RadioGroup>

const OPTIONS = [
  { value: 'standard', label: 'Standard (3–5 days)' },
  { value: 'express', label: 'Express (1–2 days)' },
  { value: 'pickup', label: 'Store pickup' },
]

export const Playground: Story = {
  render: (args) => (
    <RadioGroup {...args} defaultValue="standard">
      {OPTIONS.map((o) => (
        <Radio key={o.value} value={o.value} label={o.label} />
      ))}
    </RadioGroup>
  ),
}

export const Horizontal: Story = {
  args: { orientation: 'row' },
  render: (args) => (
    <RadioGroup {...args} defaultValue="s">
      <Radio value="s" label="Small" />
      <Radio value="m" label="Medium" />
      <Radio value="l" label="Large" />
    </RadioGroup>
  ),
}

export const WithError: Story = {
  args: { error: 'Please select an option.' },
  render: (args) => (
    <RadioGroup {...args}>
      {OPTIONS.map((o) => (
        <Radio key={o.value} value={o.value} label={o.label} />
      ))}
    </RadioGroup>
  ),
}

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <RadioGroup {...args} defaultValue="express">
      {OPTIONS.map((o) => (
        <Radio key={o.value} value={o.value} label={o.label} />
      ))}
    </RadioGroup>
  ),
}

export const Small: Story = {
  args: { size: 'sm' },
  render: (args) => (
    <RadioGroup {...args} defaultValue="standard">
      {OPTIONS.map((o) => (
        <Radio key={o.value} value={o.value} label={o.label} />
      ))}
    </RadioGroup>
  ),
}

export const PerOptionCaption: Story = {
  render: () => (
    <RadioGroup label="Plan" defaultValue="team">
      <Radio value="solo" label="Solo" caption="Just you — $9/mo." />
      <Radio value="team" label="Team" caption="Up to 10 seats — $49/mo." />
      <Radio value="enterprise" label="Enterprise" caption="Custom pricing." />
    </RadioGroup>
  ),
}

// ---------------------------------------------------------------------------
// Controlled — parent owns the state
// ---------------------------------------------------------------------------

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState<string>('standard')
    return (
      <YStack gap={12}>
        <RadioGroup
          label="Controlled group"
          value={value}
          onValueChange={setValue}
          caption={`Selected: ${value}`}
        >
          {OPTIONS.map((o) => (
            <Radio key={o.value} value={o.value} label={o.label} />
          ))}
        </RadioGroup>
        <Text fontSize={12} color="$colorMuted">
          The parent owns the value; the group never manages it internally.
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
    <YStack gap={24} padding={24} maxWidth={480}>
      <RadioGroup label="Default" defaultValue="a">
        <Radio value="a" label="Option A" />
        <Radio value="b" label="Option B" />
      </RadioGroup>

      <RadioGroup label="Horizontal" orientation="row" defaultValue="x">
        <Radio value="x" label="X" />
        <Radio value="y" label="Y" />
        <Radio value="z" label="Z" />
      </RadioGroup>

      <RadioGroup label="With per-option captions" defaultValue="standard">
        <Radio value="standard" label="Standard" caption="3–5 days" />
        <Radio value="express" label="Express" caption="1–2 days" />
      </RadioGroup>

      <RadioGroup label="Error" error="Please choose a shipping option.">
        <Radio value="standard" label="Standard" />
        <Radio value="express" label="Express" />
      </RadioGroup>

      <RadioGroup label="Disabled" disabled defaultValue="a">
        <Radio value="a" label="Option A" />
        <Radio value="b" label="Option B" />
      </RadioGroup>

      <RadioGroup label="Small" size="sm" defaultValue="s">
        <Radio value="s" label="Small option 1" />
        <Radio value="s2" label="Small option 2" />
      </RadioGroup>
    </YStack>
  ),
}
