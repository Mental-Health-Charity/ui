import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { YStack, Text } from 'tamagui'
import { Select } from './Select'

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  argTypes: {
    label: { control: 'text' },
    caption: { control: 'text' },
    error: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    native: { control: 'boolean' },
  },
  args: {
    label: 'Country',
    placeholder: 'Choose a country…',
    caption: undefined,
    error: undefined,
    disabled: false,
    native: true,
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
type Story = StoryObj<typeof Select>

const COUNTRIES = [
  { value: 'pl', label: 'Poland' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'es', label: 'Spain' },
  { value: 'it', label: 'Italy' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
]

export const Playground: Story = {
  args: { options: COUNTRIES },
}

export const WithDefaultValue: Story = {
  args: {
    options: COUNTRIES,
    defaultValue: 'pl',
  },
}

export const WithCaption: Story = {
  args: {
    options: COUNTRIES,
    caption: "Shipping estimates use the selected country's currency.",
  },
}

export const WithError: Story = {
  args: {
    options: COUNTRIES,
    error: 'Choose a country to continue.',
  },
}

export const Disabled: Story = {
  args: {
    options: COUNTRIES,
    disabled: true,
    defaultValue: 'pl',
  },
}

export const DisabledOptions: Story = {
  args: {
    label: 'Plan',
    options: [
      { value: 'solo', label: 'Solo' },
      { value: 'team', label: 'Team' },
      { value: 'enterprise', label: 'Enterprise (contact sales)', disabled: true },
    ],
    defaultValue: 'team',
  },
}

// ---------------------------------------------------------------------------
// Grouped options
// ---------------------------------------------------------------------------

export const Grouped: Story = {
  args: {
    label: 'Timezone',
    placeholder: 'Pick a timezone…',
    options: [
      {
        label: 'Europe',
        options: [
          { value: 'europe/warsaw', label: 'Warsaw (UTC+1)' },
          { value: 'europe/london', label: 'London (UTC+0)' },
          { value: 'europe/berlin', label: 'Berlin (UTC+1)' },
        ],
      },
      {
        label: 'Americas',
        options: [
          { value: 'america/new_york', label: 'New York (UTC−5)' },
          { value: 'america/los_angeles', label: 'Los Angeles (UTC−8)' },
        ],
      },
      {
        label: 'Asia',
        options: [
          { value: 'asia/tokyo', label: 'Tokyo (UTC+9)' },
          { value: 'asia/singapore', label: 'Singapore (UTC+8)' },
        ],
      },
    ],
  },
}

// ---------------------------------------------------------------------------
// Controlled
// ---------------------------------------------------------------------------

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState<string>('pl')
    return (
      <YStack gap={12}>
        <Select
          label="Controlled country"
          options={COUNTRIES}
          value={value}
          onValueChange={setValue}
          caption={`Selected: ${value}`}
        />
        <Text fontSize={12} color="$colorMuted">
          The parent owns the value; the select never manages it internally.
        </Text>
      </YStack>
    )
  },
}

// ---------------------------------------------------------------------------
// Long list — scroll behaviour
// ---------------------------------------------------------------------------

const LONG_LIST = Array.from({ length: 50 }).map((_, i) => ({
  value: `item-${i}`,
  label: `Item ${i + 1}`,
}))

export const LongList: Story = {
  args: {
    label: 'Long list (scrolls at 320px cap)',
    options: LONG_LIST,
  },
}

// ---------------------------------------------------------------------------
// Kitchen sink
// ---------------------------------------------------------------------------

export const AllStates: Story = {
  parameters: { layout: 'fullscreen' },
  decorators: [(S) => <S />],
  render: () => (
    <YStack gap={20} padding={24} maxWidth={420}>
      <Select label="Default" options={COUNTRIES} />
      <Select label="With value" options={COUNTRIES} defaultValue="fr" />
      <Select label="With caption" options={COUNTRIES} caption="Helper sits below." />
      <Select label="Error (string)" options={COUNTRIES} error="Please choose one." />
      <Select label="Error (flag only)" options={COUNTRIES} error />
      <Select label="Disabled" options={COUNTRIES} disabled defaultValue="pl" />
    </YStack>
  ),
}
