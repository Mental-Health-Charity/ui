import type { Meta, StoryObj } from '@storybook/react-vite'
import { YStack } from 'tamagui'
import { Input } from './Input'

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  argTypes: {
    label: { control: 'text' },
    caption: { control: 'text' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
  },
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
    caption: undefined,
    error: undefined,
    disabled: false,
  },
  decorators: [
    (Story) => (
      <YStack width={320}>
        <Story />
      </YStack>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Input>

export const Playground: Story = {}

export const WithCaption: Story = {
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
    caption: "We'll never share it.",
  },
}

export const WithErrorMessage: Story = {
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
    caption: "We'll never share it.",
    error: 'Enter a valid email address.',
  },
  parameters: {
    docs: {
      description: {
        story:
          'When `error` is a string it replaces the caption visually and turns the helper red. The border also flips to red and `aria-invalid` is set.',
      },
    },
  },
}

export const WithErrorFlag: Story = {
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
    error: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          '`error={true}` triggers the red border without a message — useful when the error text lives elsewhere (e.g. a form-level summary).',
      },
    },
  },
}

export const Disabled: Story = {
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
    disabled: true,
  },
}

export const NoLabel: Story = {
  args: {
    label: undefined,
    placeholder: 'Search…',
  },
}

export const AllStates: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <YStack gap={20} padding={24} maxWidth={360}>
      <Input label="Default" placeholder="Type here…" />
      <Input
        label="With caption"
        placeholder="Type here…"
        caption="Helper text sits 10px below the field."
      />
      <Input
        label="Filled"
        defaultValue="Hello world"
        caption="Text colour is ink/darker when filled."
      />
      <Input
        label="Error (string)"
        placeholder="Invalid input"
        caption="This caption is overridden."
        error="Please enter a valid value."
      />
      <Input
        label="Error (flag only)"
        placeholder="Border only, no message"
        error
      />
      <Input label="Disabled" placeholder="Not editable" disabled />
    </YStack>
  ),
}
