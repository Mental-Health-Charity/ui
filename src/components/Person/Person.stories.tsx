import type { Meta, StoryObj } from '@storybook/react-vite'
import { XStack, YStack, Text } from 'tamagui'
import { Person } from './Person'
import { Avatar } from '../Avatar'
import { Badge } from '../Badge'
import { Button } from '../Button'
import { Card } from '../Card'

const sampleSrc =
  'https://img.magnific.com/free-photo/portrait-white-man-isolated_53876-40306.jpg?semt=ais_hybrid&w=740&q=80'

const meta: Meta<typeof Person> = {
  title: 'Components/Person',
  component: Person,
  args: {
    name: 'Joe Doe',
    description: 'Administrator',
    avatar: <Avatar src={sampleSrc} name="Joe Doe" />,
  },
  decorators: [
    (Story) => (
      <YStack padding={24} width={360}>
        <Story />
      </YStack>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Person>

export const Playground: Story = {}

export const NameOnly: Story = {
  args: {
    description: undefined,
  },
}

export const InitialsFallback: Story = {
  args: {
    avatar: <Avatar name="Alice Ito" />,
    name: 'Alice Ito',
    description: 'Software engineer',
  },
}

export const AlignStart: Story = {
  args: {
    avatar: <Avatar src={sampleSrc} name="Joe Doe" size={48} />,
    name: 'Joe Doe',
    description:
      'Administrator · maintains billing, seats and audit-log access across three regions.',
    align: 'start',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Use `align="start"` when the description is long enough to wrap — keeps the avatar aligned to the first line, not visually centred against a tall text block.',
      },
    },
  },
}

export const InCard: Story = {
  render: () => (
    <Card>
      <Card.Header>
        <Person
          avatar={<Avatar src={sampleSrc} name="Joe Doe" size={40} />}
          name="Joe Doe"
          description="Administrator"
        />
      </Card.Header>
      <Card.Body>
        <Text>
          Reassigned three seats and closed the June audit. Left a note for the compliance team.
        </Text>
      </Card.Body>
      <Card.Footer>
        <Button variant="mutedPrimary">Message</Button>
        <Button>View profile</Button>
      </Card.Footer>
    </Card>
  ),
}

export const MemberList: Story = {
  parameters: { layout: 'fullscreen' },
  decorators: [(S) => <S />],
  render: () => (
    <YStack gap={0} padding={24}>
      {[
        { name: 'Joe Doe', description: 'Administrator', status: 'success' },
        { name: 'Alice Ito', description: 'Software engineer', status: 'success' },
        { name: 'Bob Smith', description: 'Support · afternoons', status: 'muted' },
        { name: 'Marie Curie', description: 'Owner', status: 'primary' },
      ].map((row) => (
        <XStack
          key={row.name}
          gap={16}
          alignItems="center"
          justifyContent="space-between"
          paddingVertical={8}
          borderBottomWidth={1}
          borderBottomColor="$borderColor"
        >
          <Person
            avatar={<Avatar name={row.name} />}
            name={row.name}
            description={row.description}
          />
          <Badge tone={row.status as never}>
            {row.status === 'success' ? 'Online' : row.status === 'primary' ? 'In meeting' : 'Away'}
          </Badge>
        </XStack>
      ))}
    </YStack>
  ),
}
