import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { YStack, Text } from 'tamagui'
import { Switch } from './Switch'

const meta: Meta<typeof Switch> = {
  title: 'Components/Switch',
  component: Switch,
  argTypes: {
    label: { control: 'text' },
    caption: { control: 'text' },
    error: { control: 'text' },
    // NB: `checked` is deliberately NOT declared as a Storybook control.
    // Setting it makes Switch a controlled component with no consumer to
    // update it, so clicks in the Playground would appear broken. Stories
    // that need a starting position use `defaultChecked` (uncontrolled) or
    // provide their own useState wrapper (see `Controlled`).
    disabled: { control: 'boolean' },
    labelStart: { control: 'boolean' },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  args: {
    label: 'Enable notifications',
    caption: undefined,
    error: undefined,
    disabled: false,
    labelStart: false,
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
type Story = StoryObj<typeof Switch>

export const Playground: Story = {}

export const On: Story = {
  args: { defaultChecked: true },
}

export const LabelStart: Story = {
  args: { labelStart: true, defaultChecked: true },
}

export const WithCaption: Story = {
  args: {
    label: 'Two-factor authentication',
    caption: 'Requires re-login on every device.',
    defaultChecked: true,
  },
}

export const WithError: Story = {
  args: {
    label: 'Accept beta terms',
    error: 'Toggle on to continue.',
  },
}

export const Disabled: Story = {
  args: { disabled: true, label: 'Locked setting' },
}

export const DisabledOn: Story = {
  args: { disabled: true, defaultChecked: true, label: 'Enforced by admin' },
}

export const Small: Story = {
  args: { size: 'sm', defaultChecked: true, label: 'Compact' },
}

export const Large: Story = {
  args: { size: 'lg', defaultChecked: true, label: 'Large touch target' },
}

// ---------------------------------------------------------------------------
// Kitchen sink
// ---------------------------------------------------------------------------

export const AllStates: Story = {
  parameters: { layout: 'fullscreen' },
  decorators: [(S) => <S />],
  render: () => (
    <YStack gap={16} padding={24} maxWidth={480}>
      <Switch label="Off" />
      <Switch label="On" defaultChecked />
      <Switch label="With caption" defaultChecked caption="Extra context sits below." />
      <Switch label="Label on left" labelStart defaultChecked />
      <Switch label="Error (flag only)" error />
      <Switch label="Error with message" error="Turn on to proceed." />
      <Switch label="Disabled + off" disabled />
      <Switch label="Disabled + on" disabled defaultChecked />
      <Switch size="sm" label="Small" defaultChecked />
      <Switch size="md" label="Medium" defaultChecked />
      <Switch size="lg" label="Large" defaultChecked />
    </YStack>
  ),
}

// ---------------------------------------------------------------------------
// Controlled
// ---------------------------------------------------------------------------

export const Controlled: Story = {
  render: () => {
    const [checked, setChecked] = useState(false)
    return (
      <YStack gap={12}>
        <Switch
          label="Airplane mode"
          checked={checked}
          onCheckedChange={setChecked}
          caption={`Current: ${checked ? 'on' : 'off'}`}
        />
        <Text fontSize={12} color="$colorMuted">
          Parent-owned state; toggle updates immediately.
        </Text>
      </YStack>
    )
  },
}

// Settings-list layout — labelStart makes for a familiar iOS-style pattern.
export const SettingsList: Story = {
  render: () => (
    <YStack
      gap={16}
      padding={16}
      borderRadius={12}
      backgroundColor="$backgroundStrong"
      width="100%"
    >
      <Switch labelStart label="Push notifications" defaultChecked />
      <Switch labelStart label="Sound" defaultChecked />
      <Switch labelStart label="Vibration" />
      <Switch labelStart label="Auto-lock (paid plan)" disabled />
    </YStack>
  ),
}
