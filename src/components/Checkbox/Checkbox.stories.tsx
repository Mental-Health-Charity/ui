import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { YStack, Text } from 'tamagui'
import { Checkbox, CheckboxGroup } from './Checkbox'

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  argTypes: {
    label: { control: 'text' },
    caption: { control: 'text' },
    error: { control: 'text' },
    checked: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    disabled: { control: 'boolean' },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md'],
    },
  },
  args: {
    label: 'I agree to the terms',
    caption: undefined,
    error: undefined,
    checked: false,
    indeterminate: false,
    disabled: false,
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
type Story = StoryObj<typeof Checkbox>

export const Playground: Story = {}

export const Checked: Story = {
  args: { checked: true },
}

export const Indeterminate: Story = {
  args: { indeterminate: true, label: '3 of 5 items selected' },
}

export const WithCaption: Story = {
  args: {
    label: 'Subscribe to updates',
    caption: 'We send at most one email per week.',
  },
}

export const WithError: Story = {
  args: {
    label: 'Accept the privacy policy',
    error: 'You must accept before continuing.',
  },
}

export const Disabled: Story = {
  args: { disabled: true, label: 'Unavailable option' },
}

export const DisabledChecked: Story = {
  args: { disabled: true, checked: true, label: 'Locked selection' },
}

export const Small: Story = {
  args: { size: 'sm', label: 'Compact variant' },
}

// ---------------------------------------------------------------------------
// Kitchen sink — every state on one canvas
// ---------------------------------------------------------------------------

export const AllStates: Story = {
  parameters: { layout: 'fullscreen' },
  decorators: [(S) => <S />],
  render: () => (
    <YStack gap={16} padding={24} maxWidth={480}>
      <Checkbox label="Default" />
      <Checkbox label="Checked" defaultChecked />
      <Checkbox label="Indeterminate" indeterminate />
      <Checkbox label="With caption" caption="Helper sits under the label." />
      <Checkbox label="Error only (flag)" error />
      <Checkbox label="Error with message" error="This field is required." />
      <Checkbox label="Disabled" disabled />
      <Checkbox label="Disabled + checked" disabled defaultChecked />
      <Checkbox label="Small" size="sm" />
      <Checkbox label="Small + checked" size="sm" defaultChecked />
    </YStack>
  ),
}

// ---------------------------------------------------------------------------
// Controlled + change handler
// ---------------------------------------------------------------------------

export const Controlled: Story = {
  render: () => {
    const [checked, setChecked] = useState(false)
    return (
      <YStack gap={12}>
        <Checkbox
          label="Fully controlled"
          checked={checked}
          onCheckedChange={setChecked}
          caption={`Current value: ${String(checked)}`}
        />
        <Text fontSize={12} color="$colorMuted">
          The parent owns the state — the checkbox never manages it internally.
        </Text>
      </YStack>
    )
  },
}

// ---------------------------------------------------------------------------
// CheckboxGroup — coordinated multi-select
// ---------------------------------------------------------------------------

const FRAMEWORKS = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'solid', label: 'Solid' },
]

export const Group: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>(['react'])
    return (
      <CheckboxGroup
        label="Preferred frameworks"
        caption={`Selected: ${value.join(', ') || 'none'}`}
        value={value}
        onValueChange={setValue}
      >
        {FRAMEWORKS.map((f) => (
          <Checkbox key={f.value} value={f.value} label={f.label} />
        ))}
      </CheckboxGroup>
    )
  },
}

export const GroupHorizontal: Story = {
  render: () => (
    <CheckboxGroup label="Filters" orientation="row" gap={16} defaultValue={['bug']}>
      <Checkbox value="bug" label="Bug" />
      <Checkbox value="feature" label="Feature" />
      <Checkbox value="docs" label="Docs" />
      <Checkbox value="chore" label="Chore" />
    </CheckboxGroup>
  ),
}

export const GroupWithError: Story = {
  render: () => (
    <CheckboxGroup
      label="Notification channels"
      error="Pick at least one channel."
      defaultValue={[]}
    >
      <Checkbox value="email" label="Email" />
      <Checkbox value="sms" label="SMS" />
      <Checkbox value="push" label="Push notification" />
    </CheckboxGroup>
  ),
}

export const GroupDisabled: Story = {
  render: () => (
    <CheckboxGroup label="Add-ons" disabled defaultValue={['pro']}>
      <Checkbox value="pro" label="Pro features" />
      <Checkbox value="team" label="Team seats" />
      <Checkbox value="analytics" label="Analytics" />
    </CheckboxGroup>
  ),
}
