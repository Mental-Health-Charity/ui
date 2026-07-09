import type { Meta, StoryObj } from '@storybook/react-vite'
import { YStack } from 'tamagui'
import { Link } from './Link'
import { Typography } from '../Typography'

const meta: Meta<typeof Link> = {
  title: 'Components/Link',
  component: Link,
  argTypes: {
    variant: { control: 'select', options: ['inline', 'standalone'] },
    external: { control: 'boolean' },
    href: { control: 'text' },
  },
  args: {
    href: '/o-nas',
    children: 'About us',
    variant: 'standalone',
  },
}

export default meta
type Story = StoryObj<typeof Link>

export const Playground: Story = {}

export const InlineWithinParagraph: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Use `variant="inline"` to keep the underline visible while embedded in body text.',
      },
    },
  },
  render: () => (
    <YStack maxWidth={520} gap={12} padding={24}>
      <Typography variant="regularRegular">
        Read more in the{' '}
        <Link href="/docs" variant="inline">
          documentation
        </Link>{' '}
        or visit our{' '}
        <Link href="https://example.com" variant="inline" external>
          website
        </Link>{' '}
        for examples.
      </Typography>
    </YStack>
  ),
}

export const External: Story = {
  args: {
    href: 'https://example.com',
    external: true,
    children: 'Open external site',
  },
}
