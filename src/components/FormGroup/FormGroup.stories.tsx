import type { Meta, StoryObj } from '@storybook/react-vite'
import { YStack } from 'tamagui'
import { FormGroup } from './FormGroup'
import { Input } from '../Input'
import { Button } from '../Button'
import { Typography } from '../Typography'

const meta: Meta<typeof FormGroup> = {
  title: 'Components/FormGroup',
  component: FormGroup,
  decorators: [
    (Story) => (
      <YStack width={360} padding={24}>
        <Story />
      </YStack>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof FormGroup>

export const SignInForm: Story = {
  render: () => (
    <FormGroup>
      <Typography variant="title3">Sign in</Typography>
      <Input label="Email" placeholder="you@example.com" />
      <Input
        label="Password"
        placeholder="••••••••"
        caption="At least 8 characters."
      />
      <Button variant="primary" fullWidth>
        Sign in
      </Button>
    </FormGroup>
  ),
}

export const WithValidationErrors: Story = {
  render: () => (
    <FormGroup>
      <Typography variant="title3">Create account</Typography>
      <Input
        label="Email"
        defaultValue="not-an-email"
        error="Enter a valid email address."
      />
      <Input
        label="Password"
        placeholder="••••••••"
        error="Too short — minimum 8 characters."
      />
      <Input
        label="Full name"
        placeholder="Jane Doe"
        caption="This will be shown on your profile."
      />
      <Button variant="primary" fullWidth>
        Create account
      </Button>
    </FormGroup>
  ),
}

export const CustomGap: Story = {
  args: {
    gap: '$xl',
  },
  render: (args) => (
    <FormGroup {...args}>
      <Input label="Field A" placeholder="…" />
      <Input label="Field B" placeholder="…" />
      <Input label="Field C" placeholder="…" />
    </FormGroup>
  ),
}
