import type { Meta, StoryObj } from '@storybook/react-vite'
import { Text, XStack, YStack } from 'tamagui'
import { Badge } from '../Badge'
import { Typography } from '../Typography'
import { Article } from './Article'

const meta: Meta<typeof Article> = {
  title: 'Components/Article',
  component: Article,
  decorators: [
    // Story-level `parameters.layout: 'fullscreen'` opts out of the narrow
    // 360px preview frame so wide layouts (e.g. ResponsiveGrid) can use the
    // full viewport. Storybook applies story decorators INSIDE meta ones,
    // so we can't override a wrapper with `(S) => <S />` at the story level —
    // we have to gate it here based on the parameter.
    (Story, ctx) =>
      ctx.parameters.layout === 'fullscreen' ? (
        <Story />
      ) : (
        <YStack width={360} padding={24}>
          <Story />
        </YStack>
      ),
  ],
}

export default meta
type Story = StoryObj<typeof Article>

// Reusable placeholder banner — used across stories so we don't hit the
// network for a real image.
function PlaceholderBanner() {
  return (
    <YStack
      width="100%"
      height="100%"
      backgroundColor="$primarySoft"
      alignItems="center"
      justifyContent="center"
    >
      <Text fontSize={12} color="$primary">
        320 × 157 → responsive
      </Text>
    </YStack>
  )
}

export const Default: Story = {
  render: () => (
    <Article>
      <Article.Banner>
        <PlaceholderBanner />
      </Article.Banner>
      <Article.Content>
        <Typography variant="title3">The morning briefing</Typography>
        <Typography variant="smallRegular" muted>
          Aug 12 · 4 min read
        </Typography>
        <Typography variant="regularRegular">
          A short summary of the day's highlights across teams, delivered as a feed you can scroll
          through in the elevator.
        </Typography>
      </Article.Content>
    </Article>
  ),
}

export const WithBadgeAndFooter: Story = {
  render: () => (
    <Article>
      <Badge tone="primary">Product</Badge>
      <Article.Banner>
        <PlaceholderBanner />
      </Article.Banner>
      <Article.Content>
        <XStack gap={8} alignItems="center">
          <Typography variant="tinyRegular" muted>
            Updated 2h ago
          </Typography>
        </XStack>
        <Typography variant="title3">Shipping the new dashboard</Typography>
        <Typography variant="regularRegular">
          The redesigned dashboard rolls out in stages next week — here is what to expect and where
          to send feedback.
        </Typography>
      </Article.Content>
    </Article>
  ),
}

export const ResponsiveGrid: Story = {
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          "CSS Grid with `repeat(auto-fill, minmax(...))` — the column track width is decided globally, so items on partially-filled rows keep the same width as items on fully-packed rows. Flexbox `flex-wrap` + `flex-grow` doesn't give you that: leftover space is shared per-row, so a 2-item row would render wider cards than a 3-item row above it.",
      },
    },
  },
  render: () => {
    // Round-robin different tones so every card visually distinguishes its
    // category — useful for demonstrating how tag colours read across a grid.
    const categories = [
      { tone: 'primary', label: 'Product' },
      { tone: 'success', label: 'Engineering' },
      { tone: 'danger', label: 'Incident' },
      { tone: 'secondary', label: 'Finance' },
      { tone: 'muted', label: 'General' },
      { tone: 'default', label: 'Announcement' },
    ] as const

    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: 16,
          padding: 24,
        }}
      >
        {[1, 2, 3, 4, 5, 6].map((n) => {
          const cat = categories[(n - 1) % categories.length]!
          return (
            <Article key={n}>
              <Article.Banner>
                <PlaceholderBanner />
              </Article.Banner>
              <Article.Content>
                <Badge tone={cat.tone}>{cat.label}</Badge>
                <Typography variant="regularSemibold">Article {n}</Typography>
                <Typography variant="smallRegular" muted>
                  Preview of the article content — this text truncates naturally as more content is
                  added.
                </Typography>
              </Article.Content>
            </Article>
          )
        })}
      </div>
    )
  },
}
