import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { YStack, XStack, Text } from 'tamagui'
import { List } from './List'
import { Badge } from '../Badge'
import { Chip } from '../Chip'

const meta: Meta<typeof List> = {
  title: 'Components/List',
  component: List,
  argTypes: {
    variant: { control: 'inline-radio', options: ['bullet', 'number', 'plain', 'divided'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    spacing: { control: 'inline-radio', options: ['compact', 'cozy', 'relaxed'] },
    start: { control: { type: 'number', min: 1, max: 100 } },
  },
  args: {
    variant: 'plain',
    size: 'md',
    spacing: 'cozy',
    start: 1,
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
type Story = StoryObj<typeof List>

const FEATURES = [
  'Unlimited projects and collaborators',
  'Shared component libraries',
  'Real-time sync across devices',
  'Version history and rollback',
  'Priority support with 24-hour response time',
]

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

export const Playground: Story = {
  render: (args) => (
    <List {...args}>
      {FEATURES.map((line) => (
        <List.Item key={line}>{line}</List.Item>
      ))}
    </List>
  ),
}

export const Bulleted: Story = {
  args: { variant: 'bullet' },
  render: (args) => (
    <List {...args}>
      {FEATURES.map((line) => (
        <List.Item key={line}>{line}</List.Item>
      ))}
    </List>
  ),
}

export const Numbered: Story = {
  args: { variant: 'number' },
  render: (args) => (
    <List {...args}>
      <List.Item>Sign in to your account.</List.Item>
      <List.Item>Navigate to Settings → Integrations.</List.Item>
      <List.Item>Click Add integration and pick your provider.</List.Item>
      <List.Item>Copy the generated API key.</List.Item>
    </List>
  ),
}

export const NumberedStartingAtFive: Story = {
  args: { variant: 'number', start: 5 },
  render: (args) => (
    <List {...args}>
      <List.Item>Continue from step five here.</List.Item>
      <List.Item>Then step six.</List.Item>
      <List.Item>Then step seven.</List.Item>
    </List>
  ),
}

export const Divided: Story = {
  args: { variant: 'divided' },
  render: (args) => (
    <List {...args}>
      <List.Item description="Owner">Anna Kowalska</List.Item>
      <List.Item description="Editor">Jan Nowak</List.Item>
      <List.Item description="Editor">Piotr Wiśniewski</List.Item>
      <List.Item description="Viewer (read-only)">Karolina Zielińska</List.Item>
    </List>
  ),
}

// ---------------------------------------------------------------------------
// With icons, descriptions, and meta content
// ---------------------------------------------------------------------------

export const FeatureListWithIcons: Story = {
  args: { variant: 'plain', spacing: 'relaxed' },
  render: (args) => (
    <List {...args}>
      <List.Item
        startIcon={
          <Text color="$primary" fontSize={18}>
            ✓
          </Text>
        }
        description="Perfect for teams up to 10 people."
      >
        Team plan
      </List.Item>
      <List.Item
        startIcon={
          <Text color="$primary" fontSize={18}>
            ✓
          </Text>
        }
        description="Custom SSO, audit logs, and dedicated support."
      >
        Enterprise plan
      </List.Item>
      <List.Item
        startIcon={
          <Text color="$colorMuted" fontSize={18}>
            —
          </Text>
        }
        description="Reach out to sales for custom pricing."
      >
        Custom deployment
      </List.Item>
    </List>
  ),
}

export const WithMeta: Story = {
  args: { variant: 'divided' },
  render: (args) => (
    <List {...args}>
      <List.Item description="Updated 5 minutes ago" meta={<Badge tone="success">Live</Badge>}>
        Production database
      </List.Item>
      <List.Item description="Updated 2 hours ago" meta={<Badge tone="secondary">Staging</Badge>}>
        Staging database
      </List.Item>
      <List.Item description="Updated yesterday" meta={<Badge tone="danger">Down</Badge>}>
        Legacy replica
      </List.Item>
    </List>
  ),
}

// ---------------------------------------------------------------------------
// Interactive rows — navigation / menu use case
// ---------------------------------------------------------------------------

export const Interactive: Story = {
  render: () => {
    const [selected, setSelected] = useState<string>('dashboard')
    const items = [
      { id: 'dashboard', label: 'Dashboard', description: 'Overview and quick actions' },
      { id: 'projects', label: 'Projects', description: '12 active projects' },
      { id: 'team', label: 'Team', description: 'Manage members and roles' },
      { id: 'billing', label: 'Billing', description: 'Plan, invoices, payment method' },
      { id: 'settings', label: 'Settings', description: 'Preferences and integrations' },
    ]
    return (
      <List variant="plain" spacing="compact">
        {items.map((item) => (
          <List.Item
            key={item.id}
            description={item.description}
            selected={selected === item.id}
            onPress={() => setSelected(item.id)}
            meta={<Text color="$colorMuted">›</Text>}
          >
            {item.label}
          </List.Item>
        ))}
      </List>
    )
  },
}

export const InteractiveWithDisabled: Story = {
  render: () => (
    <List variant="plain" spacing="compact">
      <List.Item onPress={() => alert('Rename')}>Rename project</List.Item>
      <List.Item onPress={() => alert('Duplicate')}>Duplicate project</List.Item>
      <List.Item onPress={() => alert('Archive')}>Archive project</List.Item>
      <List.Item disabled onPress={() => alert('never')}>
        Delete project (requires admin)
      </List.Item>
    </List>
  ),
}

// ---------------------------------------------------------------------------
// Sizes
// ---------------------------------------------------------------------------

export const Small: Story = {
  args: { variant: 'bullet', size: 'sm' },
  render: (args) => (
    <List {...args}>
      {FEATURES.map((line) => (
        <List.Item key={line}>{line}</List.Item>
      ))}
    </List>
  ),
}

export const Large: Story = {
  args: { variant: 'divided', size: 'lg' },
  render: (args) => (
    <List {...args}>
      <List.Item description="From $12/mo per seat">Starter</List.Item>
      <List.Item description="From $28/mo per seat">Growth</List.Item>
      <List.Item description="Custom pricing">Enterprise</List.Item>
    </List>
  ),
}

// ---------------------------------------------------------------------------
// Custom marker / bullet tone
// ---------------------------------------------------------------------------

export const CustomBulletTone: Story = {
  args: { variant: 'bullet' },
  render: (args) => (
    <List {...args}>
      <List.Item bulletTone="primary">Highlighted item in brand colour</List.Item>
      <List.Item>Neutral default</List.Item>
      <List.Item bulletTone="muted">Muted / secondary item</List.Item>
    </List>
  ),
}

export const CustomNumberedLabels: Story = {
  args: { variant: 'number' },
  render: (args) => (
    <List {...args}>
      <List.Item markerLabel="1a.">First option in group A</List.Item>
      <List.Item markerLabel="1b.">Second option in group A</List.Item>
      <List.Item markerLabel="2a.">First option in group B</List.Item>
      <List.Item markerLabel="2b.">Second option in group B</List.Item>
    </List>
  ),
}

// ---------------------------------------------------------------------------
// Real-world compositions
// ---------------------------------------------------------------------------

export const InboxLikeList: Story = {
  parameters: { layout: 'fullscreen' },
  decorators: [(S) => <S />],
  render: () => (
    <YStack padding={24} maxWidth={640}>
      <List variant="divided">
        <List.Item
          description="Anna Kowalska • 2h ago"
          meta={
            <XStack gap="$xs">
              <Chip color="primary" variant="outlined">
                Design
              </Chip>
            </XStack>
          }
          onPress={() => alert('open')}
        >
          Design review for onboarding flow
        </List.Item>
        <List.Item
          description="Jan Nowak • 4h ago"
          meta={
            <XStack gap="$xs">
              <Chip color="danger" variant="outlined">
                Bug
              </Chip>
              <Badge tone="danger">P0</Badge>
            </XStack>
          }
          onPress={() => alert('open')}
        >
          Login redirects loop on Safari
        </List.Item>
        <List.Item
          description="Karolina Zielińska • yesterday"
          meta={<Chip color="secondary">Docs</Chip>}
          onPress={() => alert('open')}
        >
          Update README with new setup steps
        </List.Item>
        <List.Item
          description="Piotr Wiśniewski • 2 days ago"
          meta={<Badge tone="success">Merged</Badge>}
          onPress={() => alert('open')}
        >
          Refactor auth middleware into a plugin
        </List.Item>
      </List>
    </YStack>
  ),
}

// ---------------------------------------------------------------------------
// Kitchen sink
// ---------------------------------------------------------------------------

export const AllStates: Story = {
  parameters: { layout: 'fullscreen' },
  decorators: [(S) => <S />],
  render: () => (
    <YStack gap={32} padding={24} maxWidth={720}>
      <YStack gap={8}>
        <Text fontWeight="500" fontSize={14} color="$colorMuted">
          Bulleted
        </Text>
        <List variant="bullet">
          <List.Item>First bullet item.</List.Item>
          <List.Item>Second bullet item.</List.Item>
          <List.Item>
            Third bullet item with a longer line that wraps to demonstrate marker alignment.
          </List.Item>
        </List>
      </YStack>

      <YStack gap={8}>
        <Text fontWeight="500" fontSize={14} color="$colorMuted">
          Numbered
        </Text>
        <List variant="number">
          <List.Item>Do the first thing.</List.Item>
          <List.Item>Then the second thing.</List.Item>
          <List.Item>And a third with wrapping that shows the number column stays put.</List.Item>
        </List>
      </YStack>

      <YStack gap={8}>
        <Text fontWeight="500" fontSize={14} color="$colorMuted">
          Divided
        </Text>
        <List variant="divided">
          <List.Item description="Team plan • $28 per seat">Growth</List.Item>
          <List.Item description="Solo plan • $12 per seat">Starter</List.Item>
          <List.Item description="Custom pricing">Enterprise</List.Item>
        </List>
      </YStack>

      <YStack gap={8}>
        <Text fontWeight="500" fontSize={14} color="$colorMuted">
          Interactive with meta
        </Text>
        <List variant="plain" spacing="compact">
          <List.Item
            description="12 active"
            meta={<Text color="$colorMuted">›</Text>}
            onPress={() => alert('open')}
          >
            Projects
          </List.Item>
          <List.Item
            description="3 pending invitations"
            meta={<Badge tone="primary">3</Badge>}
            selected
            onPress={() => alert('open')}
          >
            Team
          </List.Item>
          <List.Item
            description="Admin only"
            meta={<Text color="$colorMuted">›</Text>}
            disabled
            onPress={() => alert('open')}
          >
            Audit log
          </List.Item>
        </List>
      </YStack>
    </YStack>
  ),
}
