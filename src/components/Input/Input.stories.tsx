import type { Meta, StoryObj } from '@storybook/react-vite'
import { YStack, Text } from 'tamagui'
import { Input } from './Input'
import { Button } from '../Button'
import { Badge } from '../Badge'

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
      <YStack width={360}>
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
    caption: "We'll never share it.",
  },
}

export const WithErrorMessage: Story = {
  args: {
    caption: "We'll never share it.",
    error: 'Enter a valid email address.',
  },
}

export const WithErrorFlag: Story = {
  args: { error: true },
}

export const Disabled: Story = {
  args: { disabled: true },
}

// ---------------------------------------------------------------------------
// Prefix / suffix — the meat of this component
// ---------------------------------------------------------------------------

export const PrefixIcon: Story = {
  args: {
    label: 'Search',
    placeholder: 'Type to search…',
    prefix: <Text color="$inkLight">🔍</Text>,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Inert content (plain text/icon) gets `pointer-events: none` so clicking it focuses the field.',
      },
    },
  },
}

export const SuffixInteractive: Story = {
  args: {
    label: 'Password',
    placeholder: '••••••••',
    caption: 'At least 8 characters.',
    suffix: <Button variant="mutedPrimary">Show</Button>,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Interactive content (element with `onPress`/`onClick`) stays clickable and does not focus the field on click.',
      },
    },
  },
}

export const BothSides: Story = {
  args: {
    label: 'Command',
    placeholder: 'Search commands…',
    prefix: <Text color="$inkLight">⌘</Text>,
    suffix: <Badge tone="muted">K</Badge>,
  },
}

export const CurrencyField: Story = {
  args: {
    label: 'Amount',
    placeholder: '0.00',
    prefix: <Text color="$inkLight">$</Text>,
    suffix: <Text color="$inkLight">USD</Text>,
    inputMode: 'decimal',
  },
}

export const ClearButton: Story = {
  render: (args) => (
    <Input
      {...args}
      label="Filter"
      defaultValue="active projects"
      suffix={
        <Button
          variant="mutedPrimary"

          onPress={() => {
            const el = document.querySelector<HTMLInputElement>('input#clearable')
            if (el) {
              el.value = ''
              el.focus()
            }
          }}
          aria-label="Clear filter"
        >
          ×
        </Button>
      }
      id="clearable"
    />
  ),
}

// ---------------------------------------------------------------------------
// Kitchen sink
// ---------------------------------------------------------------------------

export const AllStates: Story = {
  parameters: { layout: 'fullscreen' },
  decorators: [(S) => <S />],
  render: () => (
    <YStack gap={20} padding={24} maxWidth={420}>
      <Input label="Default" placeholder="Type here…" />
      <Input
        label="With prefix + suffix"
        placeholder="Search…"
        prefix={<Text color="$inkLight">🔍</Text>}
        suffix={<Badge tone="muted">⌘K</Badge>}
      />
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
        error="Please enter a valid value."
      />
      <Input label="Error (flag only)" placeholder="Border only, no message" error />
      <Input label="Disabled" placeholder="Not editable" disabled />
      <Input
        label="Disabled with adornments"
        placeholder="Not editable"
        disabled
        prefix={<Text color="$inkLight">$</Text>}
        suffix={<Text color="$inkLight">USD</Text>}
      />
    </YStack>
  ),
}

// Demonstrate focus behaviour visually — hovering the surrounding container
// should focus the field, but clicking the button suffix should NOT.
export const FocusRouting: Story = {
  render: () => (
    <YStack gap={12}>
      <Input
        label="Click anywhere in the surface"
        placeholder="…except the button"
        prefix={<Text color="$inkLight">🔍</Text>}
        suffix={
          <Button variant="mutedPrimary" onPress={() => alert('button')}>
            Action
          </Button>
        }
      />
      <Text fontSize={12} color="$colorMuted">
        Clicking the icon or the empty space focuses the field. Clicking the button fires the
        button's `onPress` without stealing focus.
      </Text>
    </YStack>
  ),
}
